const socket = io();
const token= localStorage.getItem('tokenKey');
const groupsDiv = document.getElementById('groups');
const groupdiv = document.getElementById('groupchat-div');
const chatDiv = document.getElementById('chat-div');
const chatForm = document.getElementById('chat-form');
const newChatBtn = document.getElementById('newchatBtn');
const newMessage = document.getElementById('message');
const newFile = document.getElementById('file');

//<-- SHOW GROUPS ON LOAD -->
window.addEventListener('DOMContentLoaded', ()=>{
    axios.get('http://localhost:3000/user/getgroups', {headers: {"Authorization": token}})
    .then(response=>{
         // console.log(response.data.groups);
        let groups = response.data.groups;
        groups.forEach(group => {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(`${group.name}`));
            div.className="group border-bottom"
            div.style="cursor: pointer;"
            div.value=group.id;
            groupsDiv.appendChild(div);
            div.setAttribute("onclick", `getChats(${group.id}, "${group.name}")`);
            // div.onclick=getChats(div);
            // div.addEventListener('click', getChats(group.id));

        });
    })
    .catch(err=>{
        console.log(err);
    })
})

      
//<-- OPEN GROUP CHAT -->
async function getChats(groupId, groupName){

    socket.emit('joinGroup', groupId);  //// USERS JOIN GROUP

    document.getElementById('showUsers').href=`./admin.html?groupid=${groupId}`
    document.getElementById('addUsers').href=`./admin.html?groupid=${groupId}`

    chatDiv.innerHTML="";
    document.getElementById('gc-h3').innerText= groupName;
    chatDiv.id=groupId;
    newChatBtn.value=groupId;

    let groupchatsArray, lastChatId;
    let groupchats = localStorage.getItem(`groupchats${groupId}`);

    if(groupchats===null){
        lastChatId=-1;
    }
    else{
        groupchatsArray = JSON.parse(groupchats);
        lastChatId = (groupchatsArray[groupchatsArray.length-1]).id;
        await groupchatsArray.forEach(chat => {
            let p = document.createElement('p');
            if(chat.isUrl){
                let a = document.createElement('a');
                a.href= chat.message
                const date = new Date().toISOString();
                a.textContent=`file${date}`;
                p.appendChild(document.createTextNode(`${chat.username} : `));
                p.appendChild(a);
            }
            else{
                p.appendChild(document.createTextNode(`${chat.username} : ${chat.message}`));
            }
            chatDiv.appendChild(p);
        });    
    }


    // <-- GET OLD CHATS -->
    // setInterval(()=>{
    // console.log(groupdiv);
    axios.get(`http://localhost:3000/group/getchats?groupid=${groupId}&lastchatid=${lastChatId}`, {headers: {"Authorization": token}})
        .then(response=>{
            // console.log(response);
            groupchats = localStorage.getItem(`groupchats${groupId}`);
            let chats = response.data.groupChats;
            if(chats.length!==0){
                chats.forEach(chat => {
                    let p = document.createElement('p');
                    if(chat.isUrl){
                        let a = document.createElement('a');
                        a.href= chat.message
                        const date = new Date().toISOString();
                        a.textContent=`file${date}`;
                        p.appendChild(document.createTextNode(`${chat.username} : `));
                        p.appendChild(a);
                    }
                    else{
                        p.appendChild(document.createTextNode(`${chat.username} : ${chat.message}`));
                    }
                    chatDiv.appendChild(p);
                })

                if(groupchats===null){
                    groupchats=JSON.stringify(chats)
                    // console.log('if block=> ', groupchats)
                }
                else{
                    groupchatsArray = JSON.parse(groupchats);
                    chats.forEach(chat=>{
                        groupchatsArray.push(chat);
                    });
                    groupchats=JSON.stringify(groupchatsArray);
                    // console.log('if block=> ', groupchats);
                }
                localStorage.setItem(`groupchats${groupId}`, groupchats);   
            }                    
                    // console.log(oldchats);
                   // console.log(response.data.allChats);
        })
        .catch(err=>{
            console.log(err);
        })
        // }, 3000);
}


//<-- REAL TIME CHAT -->
socket.on('message', data=>{
    if(chatDiv.id===data.groupId){
        let p = document.createElement('p');
        if(data.isUrl){
            let a = document.createElement('a');
            a.href= data.message
            const date = new Date().toISOString();
            a.textContent=`file${date}`;
            p.appendChild(document.createTextNode(`${data.username} : `));
            p.appendChild(a);
        }
        else{
            p.appendChild(document.createTextNode(`${data.username} : ${data.message}`));
        }
        chatDiv.appendChild(p);
    }
    // console.log(data); 
})


//<-- TO READ FILE -->
function readFileAsDataURL(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
          
        reader.onload = function(event){    /// INITIATES ON FILE LOAD
            resolve(event.target.result);
        };  
        reader.onerror = function(error){   /// INITIATES IF ANY FILE LOAD ERROR
            reject(error);
        };
        
        reader.readAsDataURL(file);         /// READ FILE FUNCTION
    });
}


//<-- SEND CHAT -->
chatForm.addEventListener('submit', onSendChat);

async function onSendChat(e){
    e.preventDefault();
    const groupid = newChatBtn.value;
    const file = newFile.files[0];
    const message = newMessage.value
    let obj = {
        groupid: groupid,
    }
    if(file===undefined){
        if(message===''){
            alert("Enter a message or select a file to Send message!");
        }
        else{
            obj.message=message;
        }
    }
    else {
        const filetype = file.type
        obj.fileUrl=await readFileAsDataURL(file);
        obj.filetype = filetype;
        if(message!==''){
            obj.message=message;
        }
    }
    // console.log(newChatBtn)
    console.log(obj);
    

    // <--SEND MESSAGE ON SOCKET-->
    let obj1 ={...obj, token: token};
    socket.emit('newMessage', obj1);

    //<-- SEND TO BACKEND -->
    axios.post('http://localhost:3000/group/postchat', obj, {headers: {"Authorization": token}})
    .then(response=>{
        console.log(response);
        // location.reload();
    })
    .catch(err=>{
        console.log(err);
    })
}
 