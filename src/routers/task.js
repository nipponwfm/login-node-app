const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../auth/auth')

router.get('/task/get', auth, async (req, res) => {
    try {
        const user = req.user
        await user.populate({
            path: 'task'
        }).execPopulate()
        res.send(user.task)
    } catch (e) {
        res.send(e.message)
    }
})
router.get('/task/add', auth, async (req, res) => {
    try {
        const task = new Task({description: req.query.description, owner: req.user._id})
        await task.save()
        res.redirect('/')
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router