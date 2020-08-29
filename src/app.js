//import modules
const express = require('express')
require('./db/mongoose')
const path = require('path')
const hbs = require('hbs')
const app = express()
//edit partial-view-static path
const partialsDirectory = path.join(__dirname, './templates/partials') 
hbs.registerPartials(partialsDirectory)
const viewDirectory = path.join(__dirname, './templates/views') 
app.set('view engine', 'hbs')
app.set('views', viewDirectory)
const staticDirectory = path.join(__dirname, '../public')
app.use(express.static(staticDirectory))
//router
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const otherRouter = require('./routers/other')
app.use(userRouter)
app.use(taskRouter)
app.use(otherRouter)
//set port
app.listen(process.env.PORT, () => {
    console.log('Server is up')
})