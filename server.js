var express = require("express")
var app = express()
const PORT = 3000;
app.use(express.static('static'))
app.use(express.json())
//nasłuch na określonym porcie

var lobby = {}

app.get("/", function (req, res) {
    res.sendFile("index.html")
})


app.post("/login", function (req, res) {
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

    console.log(color)
    res.send(JSON.stringify({ color }))

})


app.post("/lobby", function (req, res) {

    let id = Math.random();

    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.setHeader("Cache-Control", "no-cache, must-revalidate");

    lobby[id] = res;

    req.on('close', function () {
        delete lobby[id];
    });
})


app.post("/message", function (req, res) {
    let nick = req.body.nick
    let color = req.body.color
    let message = req.body.message
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
    let time = `${hours}:${minutes}`
    let response = {
        nick,
        color,
        message,
        time
    }

    for (let id in lobby) {
        let resA = lobby[id];
        resA.send(JSON.stringify(response));
    }

    lobby = {}
    res.end()
})



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})