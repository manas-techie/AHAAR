require('dotenv').config();
const mongoose = require('mongoose');
const initdata = require('./data.js');
const Restaurant = require('../src/model/restaurantModel.js');
main()
    .then(() => {
        console.log("connection succesful")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ahaar');

}


// const initDB = async () => {
//     await Restaurant.deleteMany({});
//     await Restaurant.insertMany(initdata.data);
//     console.log("Data was intialized");
// };


const initDB = async () => {
    await Restaurant.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "67c9b62cb22d0186fbcefaf1" }));
    await Restaurant.insertMany(initdata.data);
    console.log("Data was intialized");
};

initDB();
