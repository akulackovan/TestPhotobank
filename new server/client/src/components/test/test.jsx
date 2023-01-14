import React from 'react'
import axios from 'axios'
import { Tooltip } from '@skbkontur/react-ui';
import { ComboBox } from '@skbkontur/react-ui/components/ComboBox';

const Test = () => {
    const delay = time => args => new Promise(resolve => setTimeout(resolve, time, args));

    let maybeReject = x => (Math.random() * 3 < 1 ? Promise.reject() : Promise.resolve(x));
    const [cityarr, setCity] = React.useState([])
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
                    setCity([...cityarr, response.data.city])
                }
                )
        }
        catch (error) {
            console.log(error)
        }
    }
    while (cityarr.length == 0){
        console.log("Go")
        getAllCity()
    }
    console.log(cityarr)
        for (var i = 0; i < cityarr.length; i++)
                        var newItem = { 
                            value: cityarr[i]._id, label: cityarr[i].city,
                        }
                        console.log(newItem)

    let getItems = q =>
        Promise.resolve(
            [
                ...cityarr
            ])
            .then(delay(500))
            .then(maybeReject);

    const [selected, setSelected] = React.useState({});
    const [error, setError] = React.useState(false);

    let handleValueChange = value => {
        setSelected(value);
        setError(false);
    };

    let handleUnexpectedInput = () => {
        setSelected(null);
        setError(true);
    };

    let handleFocus = () => setError(false);
    return (<Tooltip closeButton={false} render={() => 'Item must be selected!'} trigger={error ? 'opened' : 'closed'}>
        <ComboBox
            error={error}
            getItems={getItems}
            onValueChange={handleValueChange}
            onFocus={handleFocus}
            onUnexpectedInput={handleUnexpectedInput}
            placeholder="Enter number"
            value={selected}
        />
    </Tooltip>
    )
}



export default Test

