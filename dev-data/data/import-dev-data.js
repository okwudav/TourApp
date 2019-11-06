const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
dotenv.config({ path: './../../config.env' });

mongoose.connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    // console.log(con);
    console.log('Database connected...');
}).catch(err => { console.log(err); });

// READ TOUR JSON FILES
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data seeded successfully...');

    } catch (error) {
        console.log(error)
    }
    process.exit();
}

// DELETE DATA FROM DATABASE
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted successfully...');

    } catch (error) {
        console.log(error)
    }
    process.exit();
}

console.log(process.argv);

if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deleteData();
}