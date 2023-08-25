const usersDiv = document.getElementById('users-div');
const token = localStorage.getItem('tokenKey');
const url = window.location.href;
const urlparams = new URL(url).searchParams;
const groupId = urlparams.get('groupid');


// ON LOAD GET USERS IN RESPECTIVE GROUP

window.addEventListener('DOMContentLoaded', ()=>{   
    console.log(groupId);
    axios.get(`http://localhost:3000/group/getgroupusers?groupid=${groupId}`, {headers: {"Authorization": token}})
    .then(response=>{
        console.log(response);
        let users = response.data.users;
        users.forEach(user => {
            const userEle = document.createElement('div');
            userEle.name="user";
            userEle.classList="groupUsers border-bottom"
            userEle.id=user.id;
            const delbtn = document.createElement('button');
            delbtn.innerHTML="DELETE USER"
            delbtn.className="btn btn-sm btn-danger delete";
            const adminbtn = document.createElement('button');
            adminbtn.className="btn btn-sm btn-success admin";
            adminbtn.innerHTML="MAKE ADMIN";
            userEle.appendChild(document.createTextNode(`${user.name}`));
            userEle.appendChild(delbtn);
            userEle.appendChild(adminbtn);
            usersDiv.appendChild(userEle);
        })
    })
    .catch(err=>{
        console.log(err);
    })
})


// ADMIN DELETE USER FUNCTION

usersDiv.addEventListener('click', deleteUser);
function deleteUser(e){
    if(e.target.classList.contains('delete')){
        let user = e.target.parentElement;
        let userId = user.id;
        let obj={
            userId : userId,
            groupId: groupId
        }
        console.log(obj);
        axios.post('http://localhost:3000/group/admin/deleteuser', obj, {headers: {"Authorization": token}})
        .then(response=>{
            console.log(response);
            if(response.status===201||203)
                location.href="./showgroups.html"
            else if(response.status===202){
                    location.reload();
            }
        })
        .catch(err=>{
            if(err.response.status===401){
                alert(err.response.data.error);
            }
            console.log(err);
        })
    }
}


// ADMIN MAKE OTHER USERS ADMIN FUNCTION

usersDiv.addEventListener('click', makeAdmin);
function makeAdmin(e){
    if(e.target.classList.contains('admin')){
        let user = e.target.parentElement;
        let userId = user.id;
        let obj={
            userId : userId,
            groupId: groupId
        }
        axios.post('http://localhost:3000/group/admin/makeadmin', obj, {headers: {"Authorization": token}})
        .then(response=>{
            console.log(response);
        })
        .catch(err=>{
            if(err.response.status===401){
                alert(err.response.data.error);
            }
            console.log(err);
        })
    }         
}



// ADMIN ADD USERS FUNCTION

const addUserBtn = document.getElementById('adduser');
addUserBtn.addEventListener('click', addUsers);
const addUsersForm = document.getElementById('addUsersForm');

function addUsers(){
    // GET USERS OTHER THAN USERS IN GROUP
    axios.get(`http://localhost:3000/group/admin/getuserstoadd?groupid=${groupId}`, {headers: {"Authorization": token}})
    .then(response=>{
        console.log(response);
        if(response.status===202){
            alert(response.data.message);
            location.reload();
        }
        let users = response.data.users;
        users.forEach(user => {
            const userSelect = document.createElement('input');
            const userLabel = document.createElement('label');
            userSelect.type="checkbox";
            userSelect.name="user";
            userSelect.value= `${user.id}`;
            userSelect.className="form-check-input"
            userLabel.for="user";
            userLabel.className="form-check-label"
            userLabel.appendChild(document.createTextNode(`${user.name}`));
            addUsersForm.appendChild(userSelect);
            addUsersForm.appendChild(userLabel);
        });
        let submitbtn = document.createElement('button');
        submitbtn.className="btn btn-primary btn-sm add-users"
        submitbtn.type="submit";
        submitbtn.innerHTML="ADD USER"
        addUsersForm.appendChild(submitbtn);

     // ADD THOSE USERS TO GROUP
        const newusers = document.getElementsByName('user');
        let selectedUsers=[];

        addUsersForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            newusers.forEach(newuser => {
                if(newuser.checked){
                    let userId = newuser.value;
                    selectedUsers.push(userId);
                }
            });
            let obj = {
                groupid: groupId,
                users: selectedUsers
            }
            axios.post('http://localhost:3000/group/admin/addtogroup', obj, {headers: {"Authorization": token}})
            .then(response=>{
                console.log(response);
                location.reload();
            })
            .catch(err=>{
                if(err.response.status===401){
                    alert(err.response.data.error);
                    location.reload();
                }
                console.log(err);
            })
        })
    })
    .catch(err=>{
        if(err.response.status===401){
            alert(err.response.data.error);
        }
    console.log(err);
    })
}