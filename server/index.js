import express from 'express'
import dotenv from 'dotenv'
import authRoute from './router/auth.js'
import cors from 'cors'

const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoute)
// app.use('/posts', postRoute)

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