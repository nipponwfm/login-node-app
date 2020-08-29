const mongoose = require('mongoose');
module.exports = mongoose.connect(process.env.dbURL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, (e) => {
    if (e) return console.log('Cannot connect to database')
    console.log('Database connected')
})