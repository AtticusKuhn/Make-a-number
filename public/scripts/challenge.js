if(localStorage.name && localStorage.session_id){
    if(localStorage.identifier){
        fetch("/challenge", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                act: "get_specific_challenge",
                identifier:localStorage.identifier,
                name: localStorage.name ,
                session_id: localStorage.session_id
            })
        })
        .then( response => response.json()  )
        .then(json=>{
            if(json.success){
                document.getElementById("display_challenge").innerText = `using the numbers ${json.inputs}, construct ${json.answer}`
            }else{
                if(!json.success){
                    fetch("/challenge", {
                        method: "post",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            act: "get_random_challenge",
                            name: localStorage.name ,
                            session_id: localStorage.session_id
                        })
                    })
                    .then( response => response.json()  )
                    .then(json=>{
                        if(json.success){
                            document.getElementById("display_challenge").innerText = `using the numbers ${json.inputs}, construct ${json.answer}`
                            localStorage.identifier= json.identifier
                        }else{
                            styled_alert(json.success,json.msg)
                        }
                    })

                }
            }
        })
    }else{
        fetch("/challenge", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                act: "get_random_challenge",
                name: localStorage.name ,
                session_id: localStorage.session_id
            })
        })
        .then( response => response.json()  )
        .then(json=>{
            if(json.success){
                document.getElementById("display_challenge").innerText = `using the numbers ${json.inputs}, construct ${json.answer}`
                localStorage.identifier= json.identifier
            }else{
                styled_alert(json.success,json.msg)
            }
        })
    }
}else{
    styled_alert(false,"login to get a challenge")
}
window.onload = function(){
    document.getElementById("submit_button").addEventListener("click",()=>{
        fetch("/challenge", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            act:"submit",
            name: localStorage.name ,
            session_id: localStorage.session_id,
            identifier:localStorage.identifier,
            solution:document.getElementById("submit_input").value
        })
    })
    .then( response => response.json()  )
    .then(json=>{
        styled_alert(json.success, json.msg)
        if(json.success){
            delete localStorage.identifier
        }
    })
    })
}
