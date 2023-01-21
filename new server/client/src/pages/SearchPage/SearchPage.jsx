import React, { useState, useEffect, Component } from 'react'
import axios from 'axios'
import Search from '../../components/Search/Search';


export default class SearchPage extends Component {


    render() {
        return (
        <div className='searchPage'>
                <Search id={this.props.match.params.id}/>
        </div>
    )}
}
