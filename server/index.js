const express = require('express')
const app = express()
const port = 5006
const dotenv = require("dotenv");
const GitHubHandler = require("./handlers/GitHubHandler");


if (process.env.NODE_ENV !== "production") {
    dotenv.config({path: __dirname + "/../.env"});
}

app.use("/", GitHubHandler());

app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})