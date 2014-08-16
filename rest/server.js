var express = require('express');
var student = require('./students');
var users = require('./users');



var app = express();//.createServer();
app.configure(function () {
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());//it will parse json request bodies (as well as others), and place the result in req.body:
});

app.use('/public', express.static(__dirname + '/public'));
app.use('/hikes', express.static(__dirname + '/public/hikes'));
app.use('/', express.static(__dirname + '/public'));
app.get('/students', student.findAll);
app.get('/	/:id', student.findById);
app.get('/users', users.findAll);
app.get('/users/:username', users.findByUsername);
app.post('/students', student.addStudent);
app.put('/students/:id', student.updateStudent);
app.delete('/students/:id', student.deleteStudent);


app.listen(3000);
