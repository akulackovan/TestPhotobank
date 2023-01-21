import React, {useState, useEffect, useRef} from 'react'

import axios from 'axios'

const CityCombobox = ({onChange}) => {

    const [showMenu, setShowMenu] = useState(false);
    const [selected, setSelected] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    const [options, setOptions] = useState([])

    useEffect(() => {
        try {
            axios({
                method: 'get',
                url: '/city/getallcity'
            })
                .then(response => {
                        setOptions(response.data.city)
                    }
                )
        } catch (error) {
            console.log(error)
        }
    }, []);

    const searchRef = useRef();
    useEffect(() => {
        setSearchValue("");
        if (showMenu && searchRef.current) {
            searchRef.current.focus();
        }
    }, [showMenu]);
    let newValue;


    useEffect(() => {
            const handler = () => setShowMenu(false)

            window.addEventListener("click", handler);
            return () => {
                window.removeEventListener("click", handler)
            }
        }
    )
    const handleInputClick = (e) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
    }

    const getDisplay = () => {
        if (selected) {
            return selected.city;
        }
        return "Город";
    };

    const onItemClick = (option) => {
        setSelected(option)
        onChange(option._id)
    }

    const onSearch = (e) => {
        setSearchValue(e.target.value);
        onChange(newValue);
    };
    const getOptions = () => {
        if (!searchValue) {
            return options;
        }
        return options.filter((option) => option.city.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
    };

    return (
        <div className="dropdown-container">
            <div className="dropdown-input" onClick={handleInputClick}>
                <div className="dropdown-selected-value">{getDisplay()}</div>
                <div className="dropdown-tools">
                    <div className="dropdown-tool">
                        <svg className="icon" height="20" width="20" viewBox="0 0 20 20">
                            <path
                                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            {showMenu && (<div className='dropdown-menu'>
                <div className="search-box">
                    <input onChange={onSearch} value={searchValue} ref={searchRef}/>
                </div>
                {getOptions().map((option) => (
                    <div className={'dropdown-item'}
                         onClick={() => onItemClick(option)}
                    >
                        {option.city}
                    </div>
                ))}
            </div>)}
        </div>
    )
}


export default CityCombobox