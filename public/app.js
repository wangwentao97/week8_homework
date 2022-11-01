window.addEventListener('load', function () {
    let nameInput;
    
    //sign up for a username and password
    document.getElementById('sign-up-button').addEventListener('click', () => {
        let addName = document.getElementById('username').value;
        let addPword = document.getElementById('password').value;

        let obj = {
            "user" : addName,
            "pword" : addPword
        };
        console.log(obj);

        let jsonData = JSON.stringify(obj);

        fetch('/addUser', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => {console.log(data)})
    })

    //user login via username and password
    document.getElementById('log-in-button').addEventListener('click', () => {
        let logName = document.getElementById('log-name').value;
        let logPword = document.getElementById('log-pword').value;
        let informtext = document.getElementById('log-result');
        fetch('/userInfo')
        .then(resp => resp.json())
        .then(data => {
            console.log(data.data);
            for(let i = 0; i < data.data.length; i++){
                if (logName == data.data[i].username){
                    if (logPword == data.data[i].password){
                        informtext.innerHTML = "success";
                        nameInput = data.data[i].username;
                        document.getElementById('chat-box-container').style.display = 'flex';
                    } else {
                        informtext.innerHTML = "failed";
                        document.getElementById('chat-box-container').style.display = 'none';
                    }
                } else {
                    informtext.innerHTML = "user not found";
                    document.getElementById('chat-box-container').style.display = 'none';
                }
            }
        })
    })

    //Open and connect socket
    let socket = io();
    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    /* --- Code to RECEIVE a socket message from the server --- */
    let chatBox = document.getElementById('chat-box-msgs');

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);

        //Create a message string and page element
        let receivedMsg = data.name + ": " + data.msg;
        let msgEl = document.createElement('p');
        msgEl.innerHTML = receivedMsg;

        //Add the element with the message to the page
        chatBox.appendChild(msgEl);
        //Add a bit of auto scroll for the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    /* --- Code to SEND a socket message to the Server --- */
    //let nameInput = document.getElementById('name-input')
    let msgInput = document.getElementById('msg-input');
    let sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', function () {
        let curName = nameInput;
        let curMsg = msgInput.value;
        let msgObj = { "name": curName, "msg": curMsg };
 
        //Send the message object to the server
        socket.emit('msg', msgObj);
    });
});