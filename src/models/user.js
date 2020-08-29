const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')
const { default: validator } = require('validator')
const bcrypt = require('bcryptjs')
const jswt = require('jsonwebtoken')
const userSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (value.length < 6) throw new Error("Username's length must be > 5 characters")
        }
    },
    pwd: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 8) throw new Error("Password's length must be > 8 characters")
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Email is not valid")
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})

userSchema.virtual('task', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.generateToken = async (user) => {
    try {
        const token = jswt.sign({_id: user._id.toString()}, process.env.secretCode)
        user.tokens = user.tokens.concat({token})
        await user.save()
        return token
    } catch (e) {
        throw new Error('Cannot generate token')
    }
}

userSchema.statics.checkAccount = async (user, pwd) => {
    try {
        const _user = await User.findOne({ user })
        if (!_user) throw new Error('Username is incorect')
        const isMatch = await bcrypt.compare(pwd, _user.pwd)
        if (!isMatch) throw new Error('Password is incorrect')
        return _user
    } catch (e) {
        throw new Error(e.message)
    }
}

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('pwd')) this.pwd = await bcrypt.hash(this.pwd, 8)
        next()
    } catch (e) {
        throw new Error('Cannot hash password')
    }
})

const User = model('user', userSchema)

module.exports = User