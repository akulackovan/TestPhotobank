import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoute from './router/auth.js'
import cors from 'cors'


const PORT = process.env.PORT || 3000
const app = express()

app.use(cors());

app.use(express.json())
app.use('/auth', authRoute)


async function init() {
    try {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`,
        )

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