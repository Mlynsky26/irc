let button
let input
let text
let nick
let color

function init() {
    button = document.getElementById("send")
    input = document.getElementById("mess")
    text = document.getElementById("messages")


    nick = prompt("Podaj nick:")
    while (nick.length < 4) {
        nick = prompt("Podaj prawidłowy nick")
    }
    login()

    systemMessage("/help - wyświetli pomoc")

    $(".msgContent").emoticonize();

    button.addEventListener("click", () => {
        getInputValue()
    })
    input.addEventListener("keyup", (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            getInputValue()
        }
    })
}

$(document).ready(function () {
    $("#scrollbar1").tinyscrollbar();
});


function getInputValue() {
    let value = input.value
    let first = value.split(" ")
    if (first[0]) {
        if (first[0] == "/color") {
            color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        } else if (first[0] == "/nick") {
            console.log(first)
            if (first[1] && first[1].length > 3) {
                nick = first[1]
            }
        } else if (first[0] == "/clear") {
            text.innerHTML = ""
            $('#scrollbar1').data('plugin_tinyscrollbar').update()
        } else if (first[0] == "/help") {
            systemMessage("/help - wyświetli pomoc")
            systemMessage("/clear - wyczyści wiadomości")
            systemMessage("/color - przydzieli nowy losowy kolor")
            systemMessage("/nick - przydzieli nowy wybrany nick")
        } else {
            sendMessage(value)
        }
    }
    input.value = ""
}

function systemMessage(message) {
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
    let time = `${hours}:${minutes}`
    let msg = {
        nick: "system",
        color: "red",
        message,
        time
    }
    addMessage(msg)
}

function sendMessage(message) {
    const body = JSON.stringify({ nick, color, message })

    const headers = { "Content-Type": "application/json" }

    fetch("/message", { method: "post", body, headers })
}

async function login() {
    const body = JSON.stringify({ nick })

    const headers = { "Content-Type": "application/json" }

    let data = await fetch("/login", { method: "post", body, headers })
    data = await data.json()

    color = data.color


    polling()
}

async function polling() {
    const body = JSON.stringify({ nick })

    const headers = { "Content-Type": "application/json" }

    let data = await fetch("/lobby", { method: "post", body, headers })
    if (data.status == 200) {

        data = await data.json()
        addMessage(data)
    }
    polling()
}


function addMessage(data) {
    let message = document.createElement("div")
    message.className = "message"
    let time = document.createElement("span")
    time.innerText = ` [${data.time}] `
    message.appendChild(time)

    let name = document.createElement("span")
    name.innerText = ` <@${data.nick}> `
    name.style.color = data.color
    message.appendChild(name)

    let msg = document.createElement("span")
    msg.className = "msgContent"
    msg.innerText = ` ${data.message} `
    msg.style.color = "blue"
    message.appendChild(msg)
    $(msg).emoticonize();


    text.appendChild(message)
    $('#scrollbar1').data('plugin_tinyscrollbar').update()
    $('.viewport').scrollTop($('.viewport')[0].scrollHeight)
    $(".thumb").css("top", $('.track').height() - $('.thumb').height())
}