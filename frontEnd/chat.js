
const token = localStorage.getItem('token');
const chatForm = document.getElementById('chatForm')
chatForm.addEventListener('submit',sendMessage);
const chatDiv = document.getElementById('chatDiv'); 

window.addEventListener('DOMContentLoaded',()=>{
    try{
        setInterval(async()=>{
            let getChat = await axios.get('http://localhost:3000/chats', {headers: {'Authorization': token}}) 
            if(getChat.data.success){          
                for(let i=0 ;i<getChat.data.chatData.length;i++){
                chatForm.innerHTML = chatForm.innerHTML+`${getChat.data.chatData[i].username}: ${getChat.data.chatData[i].message} <br>`;
            }
            chatDiv.innerHTML='You joined <br>';
            chatForm.appendChild(chatDiv);
            }
        },1000)
        

    }catch(err){
    }
} )

async function sendMessage(e){
    try{
        e.preventDefault();

        let message = document.getElementById('message')
        let obj ={
            message:message.value
        }
        let sendMessage = await axios.post("http://localhost:3000/chats/sendMessage",obj, {headers: {'Authorization': token}});
        console.log(sendMessage)
        if(sendMessage.data.success){
            chatForm.innerHTML = chatForm.innerHTML + `You: ${message.value} <br>`;
            console.log(chatDiv)
            message.value = '';
        }

    }catch(err){
        console.log('ERR Send_Message',err)
    }
}