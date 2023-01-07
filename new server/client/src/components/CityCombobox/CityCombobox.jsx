import React from 'react'
import axios from 'axios'
import Select from "react-select"

const CityCombobox = () => {

    const [cityarr, setCity] = React.useState("")
    const [value, setValue] = React.useState({});

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
                        setCity(response.data.city)
                }
                )
        }
        catch (error) {
            console.log(error)
        }
    }

    if (cityarr == "")
    {
        getAllCity()
        return (
            <>
            <p>I would like to render a dropdown here from the values object</p>
            </>
        )
    }
    else
    {
        return (
            <>
            <Select
                name="combobox"
                options={cityarr}
                value={value}
                onChange={setValue}
                getOptionLabel={(city) => city.city}
                getOptionValue={(city) => city._id}
            />
            </>
        )
    }
}


export default CityCombobox