require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONNECTION)
.then(()=>{
    console.log('Connection sucssful....')
})
.catch((e)=>{
    console.log(e)
})