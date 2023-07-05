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
const ArchivedChat = require('./models/archiveChatModel')


User.hasMany(Chat);
Chat.belongsTo(User);


User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Member);
Member.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);

const { Op } = require('sequelize');
var CronJob = require('cron').CronJob;

var job = new CronJob(
    '0 2 * * * *',            
async function archiveMessages() {
  try {
    
    let twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); 
    

    console.log("TIMEEE",twentyFourHoursAgo)

    const messages = await Chat.findAll({
      where: {
        createdAt: {
          [Op.lte]: twentyFourHoursAgo
        }
      }
    });
    for (const message of messages) {
        await ArchivedChat.create({
          
          message: message.message,
          username: message.username,

        });
      }
  
      
      const deletedCount = await Chat.destroy({
        where: {
          createdAt: {
            [Op.lte]: twentyFourHoursAgo
          }
        }
      });
  
    
    } catch (error) {
      console.error('Error:', error);
    }
  },
    null,                     
    true,                     
    'Asia/Kolkata'     
);


sequelize.sync({})
.then(()=>{
    server.listen(3000)
}).catch(err => console.log(err) ); 