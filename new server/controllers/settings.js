import User from '../models/User.js'
import City from '../models/City.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const settings = async (req, res) => {
    try {
        const {userId, username, password, newpass, checkpass, text, city} = req.body
        const user = await User.findOne({userId})

        if (!user) {
            return res.status(400).json({
                message: 'Такого пользователя не существует.',
            })
        }
        if (username != '')
        {
            const isUsed = await User.findOne({username})
            if (isUsed) {
                return res.status(400).json({
                message: 'Логин занят. Выберите другой',
                })
            }
        }

        if (password != '')
        {
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                return res.status(400).json({
                    message: 'Неверный пароль.',
                })
            }
            if (newpass.localeCompare(checkpass) != 0)
            {
                return res.status(400).json({
                    message: 'Пароли не совпадают.',
                })
            } 
        }
        if (text != '')
        {
            if (text.length > 512)
            {
                return res.status(401).json({
                    message: 'Описание пользователя содержит больше 512 символов.',
                })
            }
        }
        const isCity= await City.findOne({city})
        if (city != '' && !isCity) {
            return res.status(400).json({
                    message: 'Такого города нет',
                })
            }
        
        if (username != '')
        {
            await User.updateOne({_id: userId}, {username: username})
        }
        if (newpass != '' && password != '')
        { 
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(newpass, salt)
            await User.updateOne({_id: userId}, {password: hash})
        }
        if (text != '')
        { 
            await User.updateOne({_id: userId}, {text: text})
        }
        if (city != '')
        {
            const idCity = isCity._id
            await User.updateOne({_id: userId}, {city: idCity})  
        }

        res.status(201).json({
            message: 'Настройки изменены',
        })
    } catch (error) {
        res.status(400).json({message: 'Ошибка при изменении настроек.'})
    }
}

