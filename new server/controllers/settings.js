import User from '../models/User.js'
import City from '../models/City.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const settings = async (req, res) => {
    try {
        const {userId, username, password, newpass, checkpass, text, city} = req.body
        const user = await User.findOne({userId})
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }
        if (username != '')
        {
            const isUsed = await User.findOne({username})
            if (isUsed) {
                return res.status(409).json({
                message: 'Логин занят. Выберите другой',
                })
            }
            user.username = username
        }

        if (password != '')
        {
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    message: 'Неверный пароль.',
                })
            }
            if (newpass.localeCompare(checkpass) != 0)
            {
                return res.status(401).json({
                    message: 'Пароли не совпадают.',
                })
            } 
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(newpass, salt)
            user.password = hash 
        }
        if (text != '')
        {
            if (text.length > 512)
            {
                return res.status(401).json({
                    message: 'Описание пользователя содержит больше 512 символов.',
                })
            }
            user.text = text   
        }
        if (city != '')
        {
            const isCity= await City.findOne({city})
            if (!isCity) {
                return res.status(409).json({
                    message: 'Такого города нет',
                })
            }
            const idCity = isCity._id
            user.city = idCity
        }
          
        await user.save()

        res.status(201).json({
            user,
            message: 'Настройки изменены',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при изменении настроек.'})
    }
}

