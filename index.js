const express = require('express');
const reactViews = require('express-react-views');
const fs = require("fs")
const methods = require("./methods")
const app = express();
var bodyParser = require('body-parser');
const crypto = require("crypto")
//const child_process = require("child_process")
const config = require("./config.js")
const axios = require("axios")
const qs = require("qs")
//const process = require("process")
//const FormData = require('form-data');
//const fetch = require('node-fetch');
const secret_key = process.env.SECRET_KEY
// Create an encryptor:
var encryptor = require('simple-encryptor')(secret_key);
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());

app.get('/', (req, res) => {
	res.render('index');
})
app.get('/rules', (req,res) => {
	res.render('rules');
})
app.get('/login', (req,res) => {
	res.render('login');
})
app.get('/challenge', (req,res) => {
	res.render('challenge');
})
app.get('/leaderboard', (req,res) => {
	res.render('leaderboard');
})
app.get('/apileaderboard', (req,res) => {
    res.json(JSON.parse(fs.readFileSync("data/leaderboard.json")))
})
app.post("/login", async (req,res) => {
    if(req.headers["x-replit-user-name"]){
        let sessions = JSON.parse(fs.readFileSync("data/sessions.json"))
        const session_id = crypto.randomBytes(16).toString("hex")
        sessions[req.headers["x-replit-user-name"]] = encryptor.encrypt(session_id)
        fs.writeFileSync("data/sessions.json", JSON.stringify(sessions, null, 4))
        let leaderboard = JSON.parse(fs.readFileSync("data/leaderboard.json"))
        if(!leaderboard[req.headers["x-replit-user-name"]]){
            const url = 'https://repl.it/graphql';
            const data = {
                'operationName': 'userByUsername',
                'query': `
                query userByUsername($username: String!) {
                    userByUsername(username: $username) {
                        image
                    }
                }
                `,
                'variables': {
                    'username': req.headers["x-replit-user-name"]
                }
            }
            const config = {
                headers: {
                    'X-Requested-With': 'bruh',
                    'referer': 'https://repl.it'
                }
            };
            const res = await axios.post(url, qs.stringify(data), config);
            leaderboard[req.headers["x-replit-user-name"]] = {
                    "points": 0,
            }
            if(res.data.data.userByUsername){
                leaderboard[req.headers["x-replit-user-name"]].pfp = {}
                leaderboard[req.headers["x-replit-user-name"]].pfp = res.data.data.userByUsername.image 
            }
            fs.writeFileSync("data/leaderboard.json", JSON.stringify(leaderboard, null, 4))
        }
        res.json({
            success:true,
            name:req.headers["x-replit-user-name"],
            session_id:session_id
        })
    }else{
        res.json({
            success:false,
            msg:"No Header"
        })
    }
})
app.post("/challenge", async (req,res) => {
    if(req.body.act == "get_random_challenge"){
        if(methods.verify_session(req.body.name,req.body.session_id)){
            //let cooldown = JSON.parse(fs.readFileSync("data/cooldown.json"))
            if(methods.check_cooldown(req.body.session_id)){
                //cooldown[encryptor.encrypt(req.body.session_id)] = new Date().getTime()
                let challenges = JSON.parse(fs.readFileSync("data/challenges.json"))
                
                let input_array = []
                for(i=0;i<config.input_length;i++){
                    input_array[i] = methods.random_integer(config.input_limit)
                   // console.log(input_array)
                }
                let query = `${input_array[0]}`
                for(t=0;t<input_array.length-1;t++){
                    query += `${methods.random_math_function()}${input_array[t]}`
                    //console.log(query)
                }


                //let query = `${num1}${methods.random_math_function()}${num2}`
                let req_url = `http://api.wolframalpha.com/v1/result?appid=${process.env.EVAL_KEY}&i=${query}`
                //console.log(req_url)
                let answer = await axios.get(req_url)
                answer =  answer.data
                //console.log(answer)
                if(answer %1 != 0 && !isNaN(Math.floor(answer)) ){
                    answer = Math.floor(answer)
                }
                //console.log(answer)
                let identifier= crypto.randomBytes(16).toString("hex")
                challenges[identifier] = {
                    query:encryptor.encrypt(query),
                    inputs: input_array, //[num1,num2],
                    answer:answer,
                    name:req.body.name,
                    started:new Date().getTime()
                }
                for(challenge of  Object.keys(challenges) ){
                    if(new Date().getTime() - challenges[challenge].started > config.delete_interval){
                        delete challenges[challenge]
                        console.log("deleting...")
                    }
                }
                fs.writeFileSync("data/challenges.json", JSON.stringify(challenges, null, 4))
                //fs.writeFileSync("data/cooldown.json", JSON.stringify(cooldown, null, 4))

                res.json({
                    success:true,
                    inputs:input_array, //[num1,num2],
                    answer:answer,
                    identifier:identifier
                })

            }else{
                res.json({
                    success:false,
                    msg:"you are being rate limited. Don't submit so fast"
                })
            }
        }else{
            res.json({
                success:false,
                msg:"login to get challenges"
            })
        }
    }else if(req.body.act == "submit"){
        console.log("submitting")
        if(methods.verify_session(req.body.name,req.body.session_id)){
            if(methods.check_cooldown(req.body.session_id)){
                    let challenges = JSON.parse(fs.readFileSync("data/challenges.json"))
                    let solution_inputs = new Set(req.body.solution.match(/\d/g).map(e=>Number(e)))
                    if(methods.equal_sets(solution_inputs, new Set(challenges[req.body.identifier].inputs))  &&req.body.solution.match(/\d/g).length ==  challenges[req.body.identifier].inputs.length){
                        let solution = req.body.solution.replace(new RegExp("\\+","g"),'%2B')
                        let req_url = `http://api.wolframalpha.com/v1/result?appid=${process.env.EVAL_KEY}&i=${solution}`
                        let answer = await axios.get(req_url)
                        answer =  answer.data
                        if(answer == challenges[req.body.identifier].answer){
                            let leaderboard = JSON.parse(fs.readFileSync("data/leaderboard.json"))
                            leaderboard[req.body.name].points +=1
                            res.json({
                                success:true,
                                msg:"success, you earned 1 point"
                            })
                            delete challenges[req.body.identifier]
                            fs.writeFileSync("data/challenges.json", JSON.stringify(challenges, null, 4))
                            fs.writeFileSync("data/leaderboard.json", JSON.stringify(leaderboard, null, 4))

                        }else{
                            res.json({
                                success:false,
                                msg:`wrong answer, you got ${answer}`
                            })
                        }
                    }else{
                        res.json({
                            success:false,
                            msg:"you may only use the numbers given"
                        })
                    }

                }else{
                res.json({
                    success:false,
                    msg:"rate limited. Don't act so fast."
                })
            }
        }else{
            res.json({
                success:false,
                msg:"bad session"
            })
        }
        
    }else if (req.body.act == "get_specific_challenge"){
        if(req.body.identifier){
            let challenges = JSON.parse(fs.readFileSync("data/challenges.json"))
            if(challenges[req.body.identifier]){
                res.json({
                    success:true,
                    inputs:challenges[req.body.identifier].inputs,
                    answer:challenges[req.body.identifier].answer
                })
            }else{
                res.json({
                    success:false,
                    msg:"can't find it"
                })
            }
        }else{
            res.json({
                success:false,
                msg:"no identifier"
            })
        }
    }
})

app.listen(() => console.log(`server is up!`));