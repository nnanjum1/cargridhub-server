const express = require('express');
const dotenv = require('dotenv')
const app = express();
dotenv.config()

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    console.log("server is ok")
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})