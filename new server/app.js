import express from 'express'
import authRoute from './router/auth.js'
import settingRoute from './router/settings.js'
import cityRoute from './router/city.js'
import postRoute from './router/post.js'
import cors from 'cors'

export const app = express()

app.use(cors());
app.use(express.json({limit: '50mb' }));
app.use(express.urlencoded({extended: true}));

app.use(express.json())
app.use('/auth', authRoute)
app.use('/settings', settingRoute)
app.use('/post', postRoute)
app.use('/city', cityRoute)
