import React, { useState, useEffect, Component } from 'react'
import axios from 'axios'
import './PostTable.scss'

const PostTable = ({ id }) => {

    const [post, setPost] = useState(null)


    useEffect(() => {
        try {
            axios({
                method: 'get',
                url: '/post/getMe',
                headers: {
                    "content-type": "application/json"
                },
                params: {
                    'id': id
                }
            })
                .then(response => {
                    console.log(response.data.isPost)
                    setPost(response.data.isPost)
                }
                )
        }
        catch (error) {
            console.log(error)
            setPost(error.response.data.message)
        }
    }, []);

/*                
                    {post.map((option) => (
                          <li><img style={{ width: 351, height: 262 }} src={`data:img/png;base64, ${option.image}`} /></li>
                    
                         
                      ))} */

    return (
	<div class="wrapper">
		{post && <div className='gal'>
        <div class="gallery">
			<ul>
<li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/8.png" /></li>
				<li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/6.png" /></li>
			</ul>
		</div>
        <div>
        <h2 className='h2'>Фотографии закончились</h2>
        </div>
        </div>}
	</div>
            
        
    )
}

export default PostTable