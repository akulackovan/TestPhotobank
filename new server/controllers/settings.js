import User from '../models/User.js'
import City from '../models/City.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const settings = async (req, res) => {
    try {
        const {userId, oldpass, newpass, checkpass} = req.body
        const user = await User.findOne({userId})
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }
        if (oldpass != '')
        {
            const isPasswordCorrect = await bcrypt.compare(oldpass, user.password)
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    message: 'Неверный пароль.',
                })
            }
            console.log(newpass.localeCompare(checkpass))
            if (newpass.localeCompare(checkpass) != 0)
            {
                return res.status(401).json({
                    message: 'Пароли не совпадают.',
                })
            } 
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(newpass, salt)
            user.password = hash   
            await user.save()   
        }



        res.status(201).json({
            user,
            message: 'Настройки изменены',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при изменении настроек.'})
    }
}

