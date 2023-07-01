

const socket = io('http://localhost:3000')

const token = localStorage.getItem('token');
const chatForm = document.getElementById('chatForm')
chatForm.addEventListener('submit',sendMessage);
const chatDiv = document.getElementById('chatDiv'); 
let oldMessage = JSON.parse(localStorage.getItem('oldMessage'));
const msgBox = document.getElementById('msgBox');
const chatHead = document.getElementById('chatName');
const header = document.getElementById('header')
const logout = document.getElementById('logout');
const chatName = JSON.parse(localStorage.getItem('chatName'));
const getChat = JSON.stringify({ groupId: chatName.id});
const decodedToken =  parseJwt(token);


console.log("toke is",decodedToken)

socket.on('connect',()=>{
    console.log("connected with id", socket.id)
})

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}






window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        chatHead.textContent=chatName.name
        
        logout.addEventListener('click',()=>{
            localStorage.removeItem('token')
            localStorage.removeItem('oldMessage')
            window.location.href='./login.html'
        })
       
        const response = await axios.get(`http://localhost:3000/chats/getChats?lastMessageId=undefined&&getChat=${getChat}`, {headers: {'Authorization': token}});
        console.log(response)
        if(response.data.success){
                            
            let chatArray = [...response.data.chatData]
            console.log("THIS IS ",chatArray)
            if(chatArray.length>10){
                chatArray = chatArray.slice(Math.abs(10-response.data.chatData.length))
                
            }
            console.log("chatArray",chatArray)
            localStorage.setItem('oldMessage',JSON.stringify(chatArray));
            
            showChat(chatArray)

            if( response.data.isAdmin){
                const inviteBtn = document.createElement('button');
                inviteBtn.classList= 'btn btn-right'
                inviteBtn.appendChild(document.createTextNode('Invite Members'))
                header.appendChild(inviteBtn)
                inviteBtn.onclick=(async ()=>{
                    const link =  `http://localhost:3000/groups/joinGroup/${chatName.id}`;
                    alert(`Share this link with your friends to invite them ${link} `)
                })
                const groupControlBtn = document.createElement('button');
                groupControlBtn.classList= 'btn btn-right'
                groupControlBtn.appendChild(document.createTextNode('group controls'))
                header.appendChild(groupControlBtn)
                groupControlBtn.onclick=(async ()=>{
                    window.location.href = './admin.html';
                })
                

            }
        }
            
                       
        socket.on('recieve-message', async(message) => {
            let lastMessageId ;
            oldMessage= JSON.parse(localStorage.getItem('oldMessage'))
            
            if(oldMessage && oldMessage.length>0 ){
                lastMessageId = oldMessage[oldMessage.length - 1].id;
            }
            
            const response = await axios.get(`http://localhost:3000/chats/getChats?lastMessageId=${lastMessageId}&&getChat=${getChat}`, {headers: {'Authorization': token}});
              
            if (response.data.chatData.length > 0) {
                
                if(!lastMessageId){
                    localStorage.setItem('oldMessage', JSON.stringify(response.data.chatData));
                    showChat(response.data.chatData)
                    oldMessage = JSON.parse(localStorage.getItem('oldMessage'));
                    lastMessageId = oldMessage[oldMessage.length - 1].id;
                }
                const newMessage = response.data.chatData.filter(msg => msg.id > lastMessageId);

                if (newMessage.length > 0) {
                    
                    if(oldMessage.length>=10){
                        const removed= oldMessage.shift()
                    }
                    
                    oldMessage = [...oldMessage, ...newMessage];
                    while(oldMessage.length>10){

                        oldMessage.shift()
                    }
                    localStorage.setItem('oldMessage', JSON.stringify(oldMessage));
                    chatForm.innerText=''
                    chatForm.appendChild(msgBox)
                    showChat(oldMessage);
                }
            }
            
        })  
        
    }catch(err){
        console.log("ERR DOMLOADED",err)
    }    
})


function showChat(arr){
   
    for(let i=0 ;i<arr.length;i++){     
    chatForm.innerHTML = chatForm.innerHTML+`${arr[i].username}: ${arr[i].message} <br>`;
    }
}




async function sendMessage(e){
    try{
        e.preventDefault();
        let obj
        let message = document.getElementById('message').value;
        const media = document.getElementById('file');
        console.log("MEDIA",media.value)
        let downloadLink = '';
        let data;
        // console.log("Media",media.files[0])
        if(media.value){
            const file = media.files[0];
            data=new FormData();
            console.log("file",file)
            data.append('file',file)
            data.enctype = "multipart/form-data";
            console.log("data",data);
            const uploadRes = await axios.post("http://localhost:3000/chats/upload-media",data, {headers: { 'Content-Type': 'multipart/form-data'}})
            console.log(JSON.stringify(uploadRes.data))
            if(uploadRes.status===201){
                downloadLink = `<a href=${uploadRes.data.fileUrl}>Download </a>`
                
            }
            console.log(uploadRes,"res",downloadLink)

        }
        // else if(uploadRes.status===204 && uploadRes.data.message==='no media found'){
        //     downloadLink=''
        // }
        if(chatName.isGroup){
            obj={
                message:`${message} ${downloadLink}`,
                groupId: chatName.id,
                
            }
        }else{
            obj ={
                message:message,

                groupId: null
            }
        }
        
        let sendMessage = await axios.post("http://localhost:3000/chats/sendMessage",obj, {headers: {'Authorization': token}});
        console.log(sendMessage)
        if(sendMessage.data.success){
            socket.emit('send-message', message)
            console.log("sockeMessage",message)
            chatForm.innerHTML =''
            chatForm.appendChild(msgBox);
            
            console.log("OLDMESSAGE",oldMessage,sendMessage.data.chatData)
            
            
            if(oldMessage && oldMessage.length>=10){

                    oldMessage.shift()
            }
            else{
            }
            oldMessage.push(sendMessage.data.chatData);
            localStorage.setItem('oldMessage',JSON.stringify(oldMessage));

            console.log(oldMessage)
            showChat(oldMessage)
            console.log("oldMessage",oldMessage)
            
            console.log(chatDiv)
            message.value = '';
        }

    }catch(err){
        console.log('ERR Send_Message',err)
    }
}
