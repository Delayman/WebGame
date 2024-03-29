const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const path = require('path');
const mysql = require('mysql');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io =  require("socket.io")(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    
    socket.on('updateSelfScore', async(username, score) => {
        console.log(`score of ${username} update to ${score}`);

        let msg_read = `UPDATE userinfo SET score = '${score}' WHERE username = '${username}'`;
        let result = await queryDB(msg_read).then(() => 
        io.emit('updateScore'));
    })

    socket.on('like', async(username, score) => {
        let msg_read = `UPDATE userinfo SET score = '${+score + +1}' WHERE username = '${username}'`;
        let result = await queryDB(msg_read).then(() => 
        io.emit('updateScore'));
    })

    socket.on('dislike', async(username, score) => {
        let msg_read = `UPDATE userinfo SET score = '${+score - 1}' WHERE username = '${username}'`;
        let result = await queryDB(msg_read).then(() => 
        io.emit('updateScore'));
    })
});


app.use(express.static('LoginPage'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webgamedata"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY,reg_date TIMESTAMP,username VARCHAR(255),email VARCHAR(100),password VARCHAR(100),score VARCHAR(255))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username, email, password, score) VALUES("${req.body.username}", "${req.body.email}", "${req.body.password}",'0')`;
    result = await queryDB(sql);

    let sql_msg = "CREATE TABLE IF NOT EXISTS msgInfo (msg_id INT AUTO_INCREMENT PRIMARY KEY, user VARCHAR(255), message VARCHAR(100), likeCount VARCHAR(100), dislikeCount VARCHAR(100))";
    result = await queryDB(sql_msg);

    console.log("New Data Created!")
    return res.redirect('public/login.html')
})

let tablename = "userInfo";

app.get('/logout', (req,res) => {

    res.clearCookie('username');
    return res.redirect('public/login.html');
})

let tablename_msg = "msgInfo";
app.get('/readPost', async (req,res) => {
    
    let msg_read = `SELECT user, message FROM ${tablename_msg}`;
    let result = await queryDB(msg_read);
    result = Object.assign({},result);
    var jsonData = JSON.stringify(result);
    res.json(jsonData);
})

app.get('/readScore', async (req,res) => {
    
    let username = req.cookies.username
    let msg_read = `SELECT score FROM ${tablename} WHERE username = '${username}'` ;
    let result = await queryDB(msg_read);
    result = Object.assign({},result);
    console.log(result);
    var jsonData = JSON.stringify(result);
    res.json(jsonData);
})


app.post('/writePost',async (req,res) => {
    const newMsg = req.body;
    var keys = Object.keys(newMsg);

    let sql_msg = "CREATE TABLE IF NOT EXISTS msgInfo (msg_id INT AUTO_INCREMENT PRIMARY KEY, user VARCHAR(255), message VARCHAR(100), likeCount VARCHAR(100), dislikeCount VARCHAR(100))";
    let result_msg = await queryDB(sql_msg);
    sql_msg = `INSERT INTO msgInfo (user, message) VALUES("${newMsg[keys[0]]}", "${newMsg[keys[1]]}")`;
    result_msg = await queryDB(sql_msg);
    res.json(result_msg);
})

app.get('/readRanking', async (req,res) => {
    
    let ranking_read = `SELECT username, score FROM ${tablename} ORDER BY CAST(score AS INT) DESC LIMIT 10`;
    let result = await queryDB(ranking_read);  
    result = Object.assign({},result);

    var jsonData = JSON.stringify(result);
    res.json(jsonData);
})

app.post('/checkLogin',async (req,res) => {

    let sql = `SELECT  id, username, password, score FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result)

    const username = req.body.username;
    const password = req.body.password;
    var Obj = Object.keys(result);
    var isCorrect = false;

    for(var i = 0; i < Obj.length ; i++)
    {
        var temp = result[Obj[i]];
        var dataUsername = temp.username;
        var dataPassword = temp.password;

        if(dataUsername == username && dataPassword == password)
        {
            isCorrect = true;
            res.cookie('username', username);
        }
    }

    if(isCorrect)
    {
        return res.redirect('Game.html');
    }else
    {
        return res.redirect('public/login.html?error=1')
    }
})


app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/public/Login.html`);
});

server.listen(port, ()=>{
  console.log('listening on *:3000');
});
