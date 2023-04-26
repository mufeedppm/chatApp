require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

const sequelize = require('./utility/database');

const userRoutes = require('./routes/userRoutes');

app.use('/user',userRoutes);

sequelize.sync().then(()=>{
    app.listen(3000)
}).catch(err => console.log(err) );