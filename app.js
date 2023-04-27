require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.static(path.join(__dirname,'frontEnd')))

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

const sequelize = require('./utility/database');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')

app.use('/user',userRoutes);
app.use('/chats',chatRoutes);

const User = require('./models/userModel');
const Chat = require('./models/chatModel');

User.hasMany(Chat);
Chat.belongsTo(User);


sequelize.sync()
.then(()=>{
    app.listen(3000)
}).catch(err => console.log(err) );