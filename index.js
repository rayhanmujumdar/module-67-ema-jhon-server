const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000
const cors = require("cors")
app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    res.send("all ok")
})

app.listen(port,() => {
    console.log("that port is all ok",port)
})