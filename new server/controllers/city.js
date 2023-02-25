import City from '../models/City.js'

/** Получение города по id */
export const getCity = async (req, res) => {
    try {
        const isCity = await City.findOne({ _id: req.query.cityId })
        if (!isCity) {
            return res.status(400).json({
                message: 'Города нет',
            })
        }
        return res.status(200).json({
            isCity,
            message: 'Город найден',
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Ошибка при получении города'
        })
    }
}

/** Получение всех городов */
export const getAllCity = async (req, res) => {
    try {
        const city = await City.find()
        return res.status(200).json({
            city,
            message: 'Города получены',
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Ошибка при получении городов'
        })
    }
}