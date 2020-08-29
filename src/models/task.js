const {Schema, model} = require('mongoose')

const taskSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
})

const Task = model('task', taskSchema)

module.exports = Task