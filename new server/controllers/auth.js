import User from '../models/User.js'
import City from '../models/City.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as fs from 'fs'
import path from 'path'

export const register = async (req, res) => {
    try {
        const {username, password, city} = req.body
        if (username =='' || password == '' || city == '')
        {
            return res.status(400).json({
                message: 'Заполнены не все поля',
            })
        }
        const isUsed = await User.findOne({username})
        if (isUsed) {
            return res.status(409).json({
                message: 'Логин занят. Выберите другой',
            })
        }
        const isCity= await City.findOne({_id: city})
        if (!isCity) {
            return res.status(409).json({
                message: 'Такого города нет',
            })
        }
        const idCity = isCity._id
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        
        const __dirname = path.resolve();
        console.log(__dirname)
        //const img = path.join(__dirname +'/uploads/avatar/user_image_default.png')
        var base = 'iVBORw0KGgoAAAANSUhEUgAAAeAAAAHgCAMAAABKCk6nAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC5VBMVEUAAABmZmZTWlpUWFtVWl1UWl5TWV5UWVxUWlxUWV1TWV1UWF1UWV1UWV1UWF1TWF5VWV1dXV1VWl5TWF1TWF5UWV1UWl1UWV1VWV1UWV1VVVVTWV5VWlxUWV5UWV1VW1uAgIBRV1xUWlxVWV1UWV1UWV1UWV1bW1tVWF5TWF1UWV1UWV5TWVxOYmJVVVVTWV1TWl1UWV1UWF1UWlxAQEBUWl5UWVxUWV1UWl1UWV5VWFxSW1tUWV1UWF5UWV1UWlxJSW1TWV1VWlxNTWZRXl5UWFxUWV1UWV1UWl5VVWNVVVVUWV1UWV1QYGBUWV1UWV1TWF1UWV1VWl1SWl9YWGFUWV1TWl1VVV4AAABVWl1VXFxVWFxXV11UWlxUWV1VWV5VVV5VWVxUWV1UWl1TWV5UWVxUWV5UWV1XV19VWFxTWVxVWV1UWV1UWV1gYGBUWV1VVWFUWV1UWF1XV15UWV1VWl9UWV1SW1tUWFxVWVxTWl5UWFxVWV1UWV1SV1tTWF5UWV1VVVVUWV1UWV1UW15TWl1UWV1UWV1UWl1VXFxUWV1VWlxYWFhUWV5VWV1UWV5SW19UWV1VWl1UWV1VWV1VWV5VVVVTWV1aWlpVWV1VXV1YWGBUWF5UWV5UWV1VWF5UWF1UWVxTWV1VW1tVWV5VWV1TWV9UWV5UWV1UWV1UWl5UWV1SWlpUWFxUWVxTWVxUWV5UWV1TWV1VWF1VWF5UWV1UWV1UWV1UWl1TWF1UWl1UWVxVWF5UWl1TWl1TWV1UWV5UWFxUWV1VWV5VWV5SXFxUWV1TWWBUWFxTWVxUWV1UWVxVWVxVWmBTWF1SV1xUWV1UWV1SWl5TWl1TWVxVVWBVWF1UWV1TWV1UWV1UV19UWV5UWV5UWlxUWV1UWl1TWF5UWVxRV11TWF1RXV1UWV1TWF1TWV1VWV1UWl1UWV5VWV1VWV1VWF5ZWVlZWVlUWl1VWV1TWlpUWF1UWl5UWV3///8NqSb7AAAA9XRSTlMABSJDY32Qo7bJ3N7u9HxiQgs2ZZO/4fy+kgMuadr9LQIvd7jxt3YOVJzkm1MNCU2i97NeBE+r9vWpThzmiLq5B9ZvChOC6+qAEgzv8xDt5zfIzT4d/qgbAWYkxCl6+HgewcZVXKDS0SNLUH6kqgjFFdfbJukz7Dg9RUQ6P/I1MdgGwqdMSs6dWCfDbBrwrKY7zGDoe3UPgRG7ISCF5eNasJjiKnK1K2qhj7z7H0BhjbTL2crHjHndjmiXrldSpYRnf3M5PBnAKHRWms9IMDQy1b1BR1kYXdTf4EZtnltwkZaVLJ8W+ZmH04OxstBRFBeUryWti3Wrw24AAAABYktHRPbc20phAAAAB3RJTUUH5gYVFBcVlz9r4wAADahJREFUeNrt3Xtc1eUdwPHAC6YHjVQwkSMiRmEKihdSMTwaIeA1SdBMHTmdpeaN0s2GqNVKUtSZWjqzMhVzai1sK21lq1UzrFypNVZurXZrt+f/ub1OhlwP5/x+z43P+y9f/vn9vIDnd3me3xVXAAAAAAAAAAAAAAAAAAAAAAD0FhbeqnWbthHtrmzfweOJFCLS4+nQ/sp2EW07droqPIz5GCzq6s5dukbHiEbERHe7pvPVUczKNN1je0TEeUWAvHERPXrGMzVT9EronSiaLbHPtbHMTntJ112fLIKW3PeGfsxQX/1TUiNFiAYMTKOxlgYNHjJUOCL9xmGDmKdmhidECweNyAhnpvqIHzzSKxzmvWkY62o9ZKaNEq5o7xvNdJUbc3OWcM0t2WOZsFI5CbnCVXkZ45iyMlEJHuG68dlJTFrN0iptgpAiy9edacs3cZKQZvKtzFuyKUOETPm3TWXmEhUUJgrJEn1cFkszrZtQYPrtTF6K7jPuEEoMmMliS4JZs4Uy3+EOteuKPEKhxDsp4O6tjQih2BzuT7u5uvquUG7uPDq45XseoYHE+ZRw5+I3O19owXtXATWcl3m30MaChfRw2tjZQiOL7qGIs8IXC60sWUoTJ/VaJjQzoSdVnLO8WGjHcy9dnHJfotBQ3lWUccaKdKGl9JW0ccL384Sm0n9AndBdvUpoK/F++oQqdrzQWO4PKRSaacuE1ibwhDgkY0qE5haz9yEEq7sJ7ZVm0ilYBRHCAGt4thSsbGGEjpQKzlqvGYG962gV1AI6VxjCw1s8Qej/gDDGXN7Ea74IYZAH6dVcRcIoD1GseaZ4zAqcO4tmzRHfVRimlH1LzTFDGOdaqgXuRwPMC3wHu0sD/wX9sDDQbG5ZBuoRYaRCygVmfZmZgRM5xyMwjwpDbaBdIDbmmxo4/z7qBbDCKhfGmhxPvyZ1FgbbRL+m5Gw2OfAIvtDTlC3CaD+mYOO2jjc7cDFf9GjcY8JwW2jYmHG5pgfO3UbFRtwsjNeGig0bnWV+4GX96digHsICnenY4E2sxTYELuF2VkMGCyukULIB2+0I3JuS9dvhtSOw93Fa1usJYYnHaFmfQTttCbyLV2jrM19YYy016/GoPYHXULOunKH2BE7nsXBdPxEWKaJnHbttCjyEnrUlDbApcHoORWu5TlhlMEVredCuwE9S9HIFyXYF3kPSy/USlnmKppdJsC3w0zS9zEjbAj9D05riy2wLnBtPVZv/BAuxl6o1PGtfYPb713S3fYH3UbWGOPsCl1D1W1Fe+wLHcEDpt+4VFuKTO98qtDFwJ7pe0sXGwPvpeklXGwMfoOsle2wM3IGu3wiLsTFwxSDK+s0TVjpIWb9WdgZ+jrJ+re0MfIiyfm3sDDyDsn5t7Qz8U8ra+yyJ50k19bEz8GHK+h2xM/AkyvotsTPwUcr67bIzcDRl/W6xM/BmyvqV2RnYQ1m/oXYGTqesX4ydgWMoS2B+RfMrmkUWiywuk7hM4kYHNzq4VcmtyiA9b2fgFyjr187OwAMp6xdhZ+A5lPXbb2fgn1HWr6OdgV+krB+vzVqOF98tx9YVy7H5zHbRNgaupOsl3WwMvJ2ul1xjY+BjdL2kM1dJdptoY+DldL3EyoPQ+BJ4DRxlyPMkniWZ7CX7Anemag2x9gXmqxw12XekvyeeqjX15n0du/FZHf4Im+V2ml7OsvNI+bRdbdfbFfjnFK3lBrsCD6NoLf3s+kB0FEVr+4VNgW+kZx0v2xT4FXrWMTrSnr55PCqsxwJ7Ah+nZj2G2RN4HTXrMSjZlr67ulOzPidsCZxNy3rtsOTNLC97Vhow0o7AfShp9zJrLSUbUDDKhr4l8ZRsyKs2BG5NxwYt3Gx+32UL6diwbPMDb6FiI8Z5TO+bO46Kjfml6YE5WqdxSePN7pvVj4aNe9HswK9RsAlRE0zumzyagk05ZHLgO+nXpHiDDxeeVEC/pr2eb2rf/JPUC8RtpgZOpV1A3sg1s2/ZVNoFpgdPGSxfZ5Wa2PdXrLACttTAfSx3vEm3wM00L/BbVGvOL2njjiedzauyzTLcsIcOnlk0ax7D9gv/mmLNNcekvm/Tq9kWTjan7zvsJgzCwWJT+o7fQa1grDDkWx3ed2kVnLvMCDyDUkEqSDWh7wZuUQYt7IABt6Az6RS8sSW69x21jUqhCNf8HbwRj9MoND21vljK2kuhUP1G490siafoE7rX83Ttm34rdZywMl3PvpGtaOOMk1p+0aFsI2Wc8l6Whk+AJ9LFwbW0dldLI1g/O2qHZuezVHH967BtXXXqe5p9/I5brdGThzmr6eG8go6aHHUYM4PnR+54f5kOfYs/oIRbpmiwd/gB3s9xUf8Hlb8/yTln7npF6dOlsg8p4LYzCj9Ueno483df/LWK9h4OfSue6UsxT8mrWqXsD5V3SZwmfW9amY8fX5nWb8iXmTc/4gwzl+z+RfL6HtnIvBUstjaNkJM3+bfcmlRjtE/CCfHFCZw/qU5UgsvvXI7P3sqUlRrXxsWf4glbyKve6rSP3Mm7xMe+bk2WWym9HX9U7O2zlqWVRqYmfOxk3p0ZPBTUTfe1axz6hnje8XUceqWlhSmpIW9zGTAwLYdJanzdNP/J6ODrnn1ycBQz1N7e1w4HcXXsOfz0U8zOmHX13sJ9JQEf0hNTsq9wL2tm44w+1Xr/gQ4VjaWt6HBgf6dTXO6abNDjzx3acmzf4RfiKrM8F9dgeZ6syrgXDu87tmXTcwcHMR8AAAAAAAAAAAAAAAAAAAAAgHyr18duPFfU6fzMjC6fLBi5qLy8qrKyco/H4/n/53nKLv5jz8X/qCovXzRywSddMhLOdyo6tzF2Pce4a21M7Aef/u5E393Tj+YGu7kwt2T67r4nfJ+eix3LPLWxbXlRQvWCcoe/nTWgcntqRuHKcPa2qDNrxfnfnz5b4e4xShVnT3/2yIpZTFvqn9ieRR2Pl0v9ZGVe+fEt130exuzdFrY3rXq6ouOiL/44V6X6TnLunUtyNp6/MLdCKFcx98L5jRz04Kw/pGRM/6NOXz6LqfoibQpdHLG+qLo8X+ioMpWDH0L0xqE1O4XWdm7YxFHhwem+PFvTn9w6P8nVKzPp1Txn0haUCYOkb/fxvdmAhfumCwNVZXPOVgD2ZpcLY1VWn6RgY5b/KU4Y7ugT79Gxgesh31xhhZLsg9SsLTNlQYWwhnd7Gnc0L/vDm5ElLJP7BX+O/aJe+lJYaW4hP8YXr4kyioW1Eqtb+pcBTtr0l7f+v8YpLfd29cJXq0QL8GXnlnkjM8qXLFqIzS3w63g5vhGiBcnKHtei8ia5/clBDddbGS3nVdykE6tEC7Tqq6QWkTescLNooYoT7F9uFRS1Fy1YdGG83X1blYsW7shVFuedd1hA/NnWu1thvkjq/s/QbCv/FL8/irTfWPKufU/zU8la08BZdq2dz+fRtNZV8bMWPYQ4eJqgdT08z5a+aauoWe/dy0IrfojP/IWUDek93Py+n+bSsWGeh0x/pl9NxMalGv2oeOlfKdiUKoM3vPyNX8+BXDB9aGjeTH49B/pr2shvzP+9lHKBmmTgJvLYs3QLXPJy0/quS6Rac0TON6uvz0uz5snPNijvah4dBeGCMQfpjW5HrWAcNmQxPe5hWgWndKsJfb9+h1LB+nK9Ac9+4+gUvErtnxFPS6ZSKPaE69131sc0CrGw1geqDa+kUKiWTNV4fcWbsQ6Ie0PXvvd8RB0nLP5az745k2njjOe1PFC++27KOHZPS8ev+fyDLs75Qr++CVRx0mu69X05nyhO8hbp1bdXOk2cNUCrU4m3cYPDcWfH6NM3ngfAbiyl47UJfDM13HCXLn3X8gKWOwstTc4BWF9MC3dkafG6dMEzlHBLHx02ED9CB/cUqu/7JlfALopcqrpv2BEquGmS6scOM2ngLsU3pQ9yeJ3L0tUefDiQAm5rp7JvEfN3n8J9h0m8BC3BnhxlgTOYvgxfqeo7lUtgKYZOURT4ArOXo6+avj1jGL0cMZ8rCcxTfmkGqug7kbnL8zr3OOz2T/l9Y/MZuzz58v8Kr2HqMkXI7juvgqFLXUhPkxy4CzOXa7/kraJljFyuXLkHhxcycdkOSQ3MXm/pnpfZ917mLd8piYHfZtzyfSbxVUr2Mihwi7wXLNcybRXOSQscwbBV+ERW34Uc16/mUjhTUuAUZq2GrO2knzFqNdpKCtyeUatRIqfvv5i0KnKOCz/PoFV5VkrgfzNoVYZICbyTQauyR8qOUeasjozT4F9mzOrcICHwMcaszn8kBO7GmNW5SULgEYzZ6lXWVqasUH4/tiTZzf33dtIYskp3uh64I0NW6UXXA/NxFaWqXQ/8KENW6UbXAy9iyCqVuh74KENWabHrgXcxZJWiXQ+cxZBVWuZ64DyGrNIq1wOzs1+pCtcDM2O1CExgAhOYwAQGgUFgEBgEJjCBCUxgAhOYwCAwCAwCE5jABCYwgQlMYBAYBAaBQWACE5jABCYwCAwCg8AgMIEJTGACE5jABAaBQWAQmMAEJjCBCUxgAoPAIDAIDAITmMAEJjCBGTGBQWAQGAQmMIEJTGACE5jAIDAIDAITmMAEJjCBCUxgEBgEBoFBYAITmMAEJjCBCQzTAwMAAAAAAAAAAAAAAAAAAACAZv4Lxw8dewzaYaUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDYtMjFUMjA6MjM6MjErMDA6MDBzI2+RAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA2LTIxVDIwOjIzOjIxKzAwOjAwAn7XLQAAAABJRU5ErkJggg=='
        //Для загрузки картинок надо переводить их в base64 - то что наверху уже переведено - картинка по умолчанию
        /*imageToBase64(img).then(
            (response) => {
                console.log(response);
                base = response.data;
            }
        )*/
        /*ImgToBase64.getBase64String(img)
            .then(base64String => 
                {
                    base = base64String
                })
            .catch(err => 
                {
                    console.log(err)
                });*/


        const newUser = new User({
            username,
            city: idCity,
            password: hash,
            text: '',
            image:  base,
            typeImg: 'image/png'
        })
        
        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        await newUser.save()

        console.log("save")

        res.status(201).json({
            newUser,
            token,
            message: 'Регистрация успешна',
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Ошибка при создании пользователя.'})
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Неверный пароль.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '1h'},
        )

        res.json({
            token,
            user,
            message: 'Успешный вход в систему.',
        })
    } catch (error) {
        res.status(400).json({message: 'Ошибка при авторизации.'})
    }
}




export const getMe = async (req, res) => {
    try {
        const user = await  User.findOne({_id:req.query.userId})
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }


        const [subscibe] = await User.find({subscription: user})
        

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

       
        res.json({
            user,
            subscibe,
            token,
            message: 'Профиль успешен =)',
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({message: 'Нет'})
    }
}

export const subscibe = async (req, res) => {
    try {
        console.log(req.body.userId)
        if (req.body.userId == req.body.subscibe){
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }
        const user = await User.findOne({_id: req.body.userId})
        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            })
        }
        
        const user2 = await User.findOne({_id: req.body.subscibe})
        if (!user2) {
            return res.status(404).json({
                message: 'Такого пользователя не существует 2.',
            })
        }

        await User.updateOne({_id: user2}, {$push: {subscriptions: user}})  


        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: '30d'},
        )

        res.json({
            message: 'Пользователь успешно подписан',
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({message: 'Подписка не успешна'})
    }
}

export const search = async (req, res) => {
    try {
        const {name} = req.body
        const search = await User.find({"username": {$regex: `${name}`, $options: 'ix'}})
        if (!search) {
            return res.status(200).json({
                message: 'Нет подходящих под запрос пользователей',
            })
        }
        return res.status(200).json({
            user: search,
            message: 'Профили пользователей',
        })
    } catch (error) {
        res.status(401).json({message: 'Ошибка в поиске пользователя'})
    }
}
