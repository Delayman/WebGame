const fs = require('fs');
const http = require('http');
const { resolve } = require('path');

const hostname = 'localhost';
const port = 3000;
var showData = "";

const server = http.createServer((req, res) => 
{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(showData);
    res.end()
});

let readMsg = () => 
{
    return new Promise((resolve,reject) => {
        fs.readFile('cloth1.json','utf8', (err, data) => {
            if (err)
            {
                reject(err);
            } 
            else
            {
                resolve(data);
            }
        });
    })
}

let editJson = (data) =>
{
    return new Promise((resolve,reject) => 
    {
        const json = JSON.parse(data);
        var obj = Object.keys(json);

        const stock = 
        {
            item1: 2,
            item2: 3,
            item3: 5,
            item4: 2,
            item5: 5,
            item6: 8,
            item7: 1,
            item8: 9,
            item9: 0
        }

        for(var i = 0; i < obj.length ; i++)
        {
            json[obj[i]].Stock = stock[obj[i]];
        }

        const dataInJson = JSON.stringify(json, null, 2);
        console.log(dataInJson);
        
        showData = dataInJson;
        resolve(dataInJson);
    })
    
}

let writeMsg = (data) =>
{
    return new Promise((resolve, reject) => 
    {
        fs.writeFile('new_cloth.json', data , (err) => 
        {
            if (err) 
                reject(err);
            else
                resolve("New json created!")
        });
    })
}

readMsg().then(editJson).then(writeMsg).then((out) => console.log(out));

server.listen(port, hostname, () => 
{
    console.log(`Server running at   http://${hostname}:${port}/`);
});