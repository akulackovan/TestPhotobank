import React from 'react'
import axios from 'axios'

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
    console.log("Hi")
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
            <ul>1</ul>
        )
    }
}


export default CityCombobox