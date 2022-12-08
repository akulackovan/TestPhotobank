import express from 'express'
import dotenv from 'dotenv'

const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const app = express()

async function init() {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@photobank.qidx0uu.mongodb.net/photobank?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        })

        app.listen(PORT, () => {
            console.log("Start server on port ${PORT}")
        })

    }
    catch(err)
    {
        console.error(err)
    }
}


dotenv.config()

init()