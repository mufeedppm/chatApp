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
const groupRoutes = require('./routes/groupRoutes')

app.use('/user',userRoutes);
app.use('/chats',chatRoutes);
app.use('/groups',groupRoutes)

const User = require('./models/userModel');
const Chat = require('./models/chatModel');
const Member = require('./models/groupMembersModel');
const Group = require('./models/groupModel');


User.hasMany(Chat);
Chat.belongsTo(User);


User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Member);
Member.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize.sync({})
.then(()=>{
    app.listen(3000)
}).catch(err => console.log(err) ); 