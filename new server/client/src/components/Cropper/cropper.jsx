import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'


const Cropper = () => {

    const [crop, setCrop] = useState("")

    const [file, selectFile] = useState(null)

    return (
        <div>

            <div className='row'>
                <div className='col-6'>
                    <input type='file' accept='image/*' onChange={e => selectFile(e.target.files[0])}/>
                </div>
                
            </div>
        </div>
    )
}

export default Cropper