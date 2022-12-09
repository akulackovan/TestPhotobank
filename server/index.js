
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoute from './router/auth.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(cors())
app.use(express.json())

app.use('/auth', authRoute)
// app.use('/posts', postRoute)

async function init() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}.qidx0uu.mongodb.net/?retryWrites=true&w=majority`,
        )

        app.listen(PORT, () => {
            console.log(`Start server on port ${PORT}`)
        })
    } catch (error) {
        console.error(error)
    }
}

init()