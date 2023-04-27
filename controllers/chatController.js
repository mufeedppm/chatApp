const sequelize = require('../utility/database');
const Chat = require('../models/chatModel');

exports.postSendMessage = async (req,res) => {
    const t = await sequelize.transaction();
    try{
        const message = req.body.message;
        console.log('wefw',await req.user);
        const data = await req.user.createChat({
            message: message
        },{transaction: t});
        await t.commit();
        res.status(201).json({success:true, chatData: 'data'})
    }catch(err){
        await t.rollback();
         res.status(500).json({success:false, message:'ERR POSTSENDMSG', error:err})
         throw new Error(err)
    }
}

exports.getChats = async (req,res) => {
    try{
        
        res.status(201).json({success:true});
    }catch(err){
        return res.status(500).json({success: false, error: err})
    }
}