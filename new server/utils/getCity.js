import City from '../models/City.js'


export const getCity = async () => {
        const { city } = await City
        return city
}