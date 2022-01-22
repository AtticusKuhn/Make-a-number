const fs = require("fs")
const secret_key = process.env.SECRET_KEY
var encryptor = require('simple-encryptor')(secret_key);
const config = require("./config.js")

function diff(a,b){
    return b.filter(function(i) {return a.indexOf(i) < 0;});
}
function verify_session(user, session_id){
    let jsondata = JSON.parse(fs.readFileSync("data/sessions.json"))
    return encryptor.decrypt(jsondata[user]) == session_id     
}
function random_math_function(){
    return config.math_functions[Math.floor(config.math_functions.length*Math.random())]
}
function random_integer(limit){
    return Math.floor(Math.random()*limit)
}
function equal_sets(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}
function check_cooldown(session_id){
    let is_found = false
    let cooldown_json = JSON.parse(fs.readFileSync("data/cooldown.json"))
    for(session of Object.keys(cooldown_json)){
        //console.log(encryptor.decrypt(session), session_id)
        if(encryptor.decrypt(session) == session_id){
            found_session = session
            is_found = true
        }        
    }
    if(is_found){
        if(new Date().getTime() - cooldown_json[found_session] < config.cooldown_time){
            console.log(new Date().getTime() - cooldown_json[found_session])
            return false
        }
        cooldown_json[found_session] = new Date().getTime()
    }else{
        cooldown_json[encryptor.encrypt(session_id)] =new Date().getTime()
    }
    fs.writeFileSync("data/cooldown.json", JSON.stringify(cooldown_json, null, 4))
    return true
}

module.exports = {
    diff:diff,
    verify_session:verify_session,
    random_math_function:random_math_function,
    random_integer:random_integer,
    equal_sets:equal_sets,
    check_cooldown:check_cooldown
}