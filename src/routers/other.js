const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Cookies = require('cookies')
const auth = require('../auth/auth')

router.get('', auth, async (req, res) => {
    res.render('home', {title:'Home', login: req.auth?true:false})
})

router.get('/login', async (req, res) => {
    res.render('login', {title:'Login'})
})

router.get('/login/process', async (req, res) => {
    try {
        const user = await User.checkAccount(req.query.user, req.query.pwd)
        const cookies = new Cookies(req,res)
        cookies.set('jswt', await User.generateToken(user))
        res.status(200).redirect('/')
    } catch (e) {
        res.send(e.message)
    }
})

router.get('/register', async (req, res) => {
    res.render('register', {title:'Register'})
})
router.get('/register/process', async (req, res) => {
    try {
        const user = new User({user: req.query.user, pwd: req.query.pwd, email: req.query.email})
        await user.save()
        res.status(200).redirect('/login')
    } catch (e) {
        res.send(e.message)
    }
})

router.get('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( (value) => {
            return value.token!==req.token
        })
        await req.user.save()
        const cookies = new Cookies(req, res)
        cookies.set('jswt')
        res.redirect('/')
    } catch (e) {
        res.send(e.message)
    }
})

module.exports = router