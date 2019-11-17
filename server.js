const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose.connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    // console.log(con);
    console.log('Database connected...');
}).catch(err => { console.log(err); });

// console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening from port ${port}...`);
}); 