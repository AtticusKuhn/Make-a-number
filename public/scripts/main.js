function styled_alert(status, message){
    if(status){
        document.getElementById("alert_container").style.backgroundColor= "#80FF82"
    }else{
        document.getElementById("alert_container").style.backgroundColor= "#FF5773"
    }
    document.getElementById("alert_container").style.display= "block"
   document.getElementById("message").innerText = message
}
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("close").addEventListener("click",()=>{
        document.getElementById("alert_container").style.display= "none"
    })
    document.title = "Make Numbers"
    if (location.protocol !== 'https:') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
    if(location.href.substring(0,location.href.length-location.pathname.length) == "https://make-a-number--atticuskuhn.repl.co"){
        location.replace(`https://make-a-number.atticuskuhn.repl.co${location.pathname}`)
    }
    let links = document.getElementsByTagName("a")
    for(i=0;i<links.length;i++){
        console.log(links[i].href,location.href)
        if(links[i].href == location.href){
            links[i].style.backgroundColor = "#f1f1f1"
        }
    }
})