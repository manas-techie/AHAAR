require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log('Connection sucssful....')
})
.catch((e)=>{
    console.log("e",e)
})