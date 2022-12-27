import React, {useState, useContext} from 'react'
import { Redirect } from "react-router-dom"
import axios from 'axios'


const CityCombobox = () =>
{

    const [cityarr, setCity] = React.useState('')
    

    const getAllCity = async () => {
        try {
            await axios({
                method: 'get',
                url: '/city/getallcity',
                headers: {
                    "x-auth-token": localStorage.getItem('auth-token'),
                    "content-type": "application/json"
                },
                params: {
                    
                }
            })
                .then(response => {
                    setCity([])
                    console.log(response.data.city)
                    response.data.city.map(city=>
                        {
                            setCity(cityarr => [...cityarr, city.city])
                        })
                }
            )
        }
        catch (error) {
            console.log(error)
        }
    }

    getAllCity()
    
    console.log("Array")
    console.log(cityarr)
    
      return (
            <select id="selectIndustry">
                {cityarr.map((city) => (
                <option>{city}</option>
            ))}
            </select>
      )

    

}


export default CityCombobox