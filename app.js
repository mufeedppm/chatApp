require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketIO(server);


io.on('connection', socket => {
    console.log('Socket Id:',socket.id)
    socket.on('send-message', message => {
        socket.broadcast.emit('recieve-message', { message: message })
    })
})

// app.use(express.static(path.join(__dirname,'frontEnd')))

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

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`frontEnd/${req.url}`))
})

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
    server.listen(3000)
}).catch(err => console.log(err) ); 