import City from '../models/City.js'


export const addCity = async (req, res) => {
    try {
        const { city } = req.body
        const isCity = await User.findOne({ city })
        if (isCity) {
            return res.json({
                message: 'Город уже добавлен.',
            })
        }

        const newCity = new City({
            city
        })

        await newCity.save()
        res.json({
            newCity,
            token,
            message: 'Город добавлен.',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при создании города.' })
    }
}

export const getCity = async (req, res) => {
    try {
        const isCity = await City.findOne( {_id:req.query.cityId})
        if (!isCity) {
            return res.json({
                message: 'Города нет',
            })
        }

        res.json({
            isCity,
            message: 'Город найден',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при получении города' })
    }
}


export const getAllCity = async (req, res) => {
    try {
        const city = await City
        res.json({
            city,
            message: 'Город найден',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при получении города' })
    }
}