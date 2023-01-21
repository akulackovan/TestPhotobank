import React, { useState, useEffect, Component, useContext } from 'react'
import axios from 'axios'

const Search = ({ id}) => {

    return (
        <div className='allPost'>
            <h1>{id}</h1>
        </div>
    )
}

export default Search