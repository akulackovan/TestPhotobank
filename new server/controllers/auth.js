import User from '../models/User.js'
import City from '../models/City.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        const {username, password, city} = req.body
        const isUsed = await User.findOne({username})
        console.log("Reg")
        console.log(isUsed)
        if (isUsed) {
            return res.status(409).json({
                message: 'Логин занят. Выберите другой',
            })
        }
        const isCity= await City.findOne({city})
        if (!isCity) {
            return res.status(409).json({
                message: 'Такого города нет',
            })
        }
        const idCity = isCity._id
        console.log(idCity)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const newUser = new User({
            username,
            city: idCity,
            password: hash,
        })
        
        console.log(newUser)
        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )
        
        console.log("Test2")

        await newUser.save()

        console.log("save")

        res.status(201).json({
            newUser,
            token,
            message: 'Регистрация успешна',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при создании пользователя.'})
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Неверный пароль.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '1h'},
        )

        res.json({
            token,
            user,
            message: 'Успешный вход в систему.',
        })
    } catch (error) {
        res.status(400).json({message: 'Ошибка при авторизации.'})
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        res.json({
            user,
            token,
            message: 'Профиль успешен =)',
        })
    } catch (error) {
        res.status(401).json({message: 'Нет доступа'})
    }
}