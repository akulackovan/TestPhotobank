import User from '../models/City.js'


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