import React, { useState, useEffect, Component } from 'react'
import axios from 'axios'

const PostPageComponent = ({id}) => {


    const [post, setPost] = useState(
        {
            id: null,
            image: null,
            comments: null,
            likes: null,
            text: null,
            views: null,

        }
    )

        useEffect(() => {
           try{ axios({
                method: 'get',
                url: '/post',
                headers: {
                    "content-type": "application/json"
                },
                params: {
                    'id': id
                }
            })
                .then(response => {
                    setPost(response.data)
                    console.log(response.data)
                }
                )
            }
            catch (error) {
                console.log(error)
                setPost(error.response.data.message)
            }
        }, []);

    return (
        <div className='profile'>
            
        </div>
    )
}

export default PostPageComponent