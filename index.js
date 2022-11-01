//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

app.use(express.json());
let Datastore = require('nedb');
let db = new Datastore('userinfo.db');

db.loadDatabase();

//store user info in db
app.post('/addUser', (req, res) => {
    console.log(req.body);

    let obj = {
        username: req.body.user,
        password: req.body.pword
    }

    db.insert(obj, (err, newDocs) => {
        if (err){
            res.json({task: "failed"});
        } else {
            res.json({task: "success"});
        }
        
    })
    //userData.push(obj);
    //console.log(userData);
})

//request user info
app.get('/userInfo', (req, res) => {
    db.find({}, (err, docs) =>{
        if (err){
            res.json({task: "task failed"});
        } else {
            let obj = {data: docs};
            res.json(obj);
        }  
    })
    
}) 

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);

        //Send a response to all other clients, not including this one
        // socket.broadcast.emit('msg', data);

        //Send a response to just this client
        // socket.emit('msg', data);
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});