const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('LoginPage'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//       callback(null, 'public/img/');
//     },

//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
//   });

// const imageFilter = (req, file, cb) => {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//         req.fileValidationError = 'Only image files are allowed!';
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
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
        // query method
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

//ทำให้สมบูรณ์
// app.post('/profilepic', (req,res) => {
//     let upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');

//     upload(req, res, (err) => {

//         if (req.fileValidationError) {
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             return res.send('Please select an image to upload');
//         }
//         else if (err instanceof multer.MulterError) {
//             return res.send(err);
//         }
//         else if (err) {
//             return res.send(err);
//         }
//         let username = getCookie('username');
//         updateImg(username,req.file.filename)
//         res.cookie('img' , req.file.filename);
//         return res.redirect('feed.html')
//     });
//     function getCookie(name){
//         var value = "";
//         try{
//             value = req.headers.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
//             // console.log(value);
//             return value
//         }catch(err){
//             return false
//         } 
//     }
// })
let tablename = "userInfo";
// const updateImg = async (username, filen) => {
//     let sql =  `UPDATE ${tablename} SET img = '${filen}' WHERE username = '${username}'`;
//     let result = await queryDB(sql);
//     console.log(result);
// }

//ทำให้สมบูรณ์
app.get('/logout', (req,res) => {

    res.clearCookie('username');
    return res.redirect('public/login.html');
})

//ทำให้สมบูรณ์
let tablename_msg = "msgInfo";
app.get('/readPost', async (req,res) => {
    
    let msg_read = `SELECT user, message FROM ${tablename_msg}`;
    let result = await queryDB(msg_read);
    result = Object.assign({},result);
    var jsonData = JSON.stringify(result);
    res.json(jsonData);
})

//ทำให้สมบูรณ์
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
    
    let ranking_read = `SELECT username, score FROM ${tablename} ORDER BY score DESC LIMIT 5`;
    let result = await queryDB(ranking_read);
    result = Object.assign({},result);
    // var jsonData = JSON.stringify(result);
    // res.json(jsonData);

    for(const key in result)
    {
        console.log(`${key}:${result[key].username},${result[key].score}`);
    }

    // console.log(result.map((element) => element));
    

})

//ทำให้สมบูรณ์

app.post('/checkLogin',async (req,res) => {
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')

    let sql = `SELECT  id, username, password, score FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result)
    //console.log(result);

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
        return res.redirect('public/index.html?error=1')
    }
})


 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/public/login.html`);
});
