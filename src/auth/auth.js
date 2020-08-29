const Cookies = require('cookies')
const User = require('../models/user')

module.exports = auth = async (req, res, next) => {
    try {
        const cookies = new Cookies(req, res)
        if (cookies.get('jswt')) {
            req.auth = true
            req.token = cookies.get('jswt')
            const user = await User.findOne({'tokens.token': req.token})
            req.user = user
        }
        else req.auth = false
        next()
    } catch (e) {
        throw new Error('You have to authorized')
    }
}