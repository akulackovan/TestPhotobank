import City from '../models/City.js'
import fs from 'fs'


export const getCity = async (req, res) => {
    try {
        const isCity = await City.findOne({ _id: req.query.cityId })
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
        const city = await City.find()
        res.json({
            city,
            message: 'Города получены',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при получении города' })
    }
}

/*
Так добавляли города
export const addCityFromFile = async (req, res) => {
    try {
        var array = fs.readFileSync("D:\\GitHub\\Another\\new server\\controllers\\city.txt").toString().split("\n");
        for (const i of array) {
            
                
            console.log(i);
            const isCity = await City.findOne({city: i})
            if (!isCity) {
                
            console.log(i);
                const newCity = new City({
                city: i
            })
            await newCity.save()
                }

            
        }
        res.json({
            message: 'Город добавлен.',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при создании города.' })
        console.log(error)
    }
}
*/