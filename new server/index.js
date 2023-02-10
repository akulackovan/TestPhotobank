import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoute from './router/auth.js'
import settingRoute from './router/settings.js'
import cityRoute from './router/city.js'
import postRoute from './router/post.js'
import cors from 'cors'

const PORT = process.env.PORT || 5000
const app = express()



app.use(cors());
app.use(express.json({limit: '50mb' }));
app.use(express.urlencoded({extended: true}));

app.use(express.json())
app.use('/auth', authRoute)
app.use('/settings', settingRoute)
app.use('/post', postRoute)
app.use('/city', cityRoute)

async function init() {
    try {
        await mongoose.connect(
            `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/?retryWrites=true&w=majority`,
        )
        app.listen(PORT, () => {
            console.log("Start server on port", PORT)
        })
    }
    catch(err)
    {
        console.error(err)
    }
}


dotenv.config()

init()