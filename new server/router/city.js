import {Router} from "express"
import {getCity, getAllCity, addCityFromFile} from '../controllers/city.js'

const router = new Router()

router.get('/getcity', getCity)
router.get('/getallcity', getAllCity)
//router.post('/file', addCityFromFile)
export default router