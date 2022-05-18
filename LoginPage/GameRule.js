var socket = io();

socket.on('updateScore', () => {
	readRankingData();
	readSelfScore();
})

function checkCookie()
{
	var username = "";
	if(getCookie("username")==false){
		window.location = "public/login.html";
	}
}

checkCookie();
window.onload = pageLoad;
var username = getCookie('username');

// var timer = setInterval(sleep(), 1000);
function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}
var score = 0;

function pageLoad()
{
	document.getElementById('postbutton').onclick = getData;
    var img = document.getElementById("Game_Pic");
    var count = document.getElementById("Score");

	readSelfScore();
	
    img.addEventListener('mousedown', function ()
    {
        IncreaseScore();
        img.src = 'HappyLump.png';
    });
    img.addEventListener('mouseup', function ()
    {
        img.src = 'SadLump.png';
    });
    function IncreaseScore()
    {
        score++;
        count.innerHTML = score;
		socket.emit('updateSelfScore', username, score);
    }


    readRankingData();
	readComment();
	showUsername();
}

function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

async function readRankingData()
{
	let response = await fetch("/readRanking");
	let content = await response.json();
    let ranking = await showRanking(JSON.parse(content));
	
}

async function readComment()
{
	let response = await fetch("/readPost");
	let content = await response.json();
    let msg = await showComment(JSON.parse(content));
	
}

async function readSelfScore()
{
	let response = await fetch("/readScore");
	let content = await response.json();
    let ranking = await showSelfScore(JSON.parse(content));
}

async function writePost(msg)
{
	let username = getCookie('username')
	let response = await fetch("/writePost", {
		method: "POST",
		headers:
		{
			'Accept': "application/json",
			'Content-Type': 'application/json'
		},
		body: JSON.stringify
		({
			user:username,
			message:msg
		})
	});

	readComment();
}

function showRanking(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("GameRanking");
	divTag.innerHTML = "";
	for (var i = 0; i <= keys.length-1 ; i++) {

		var temp = document.createElement("div");
		temp.className = "ranking";
		divTag.appendChild(temp);
        
		var temp1 = document.createElement("div");
		temp1.className = "rankingUser" + (i+1);
		temp1.innerHTML = data[keys[i]]["username"];
		temp.appendChild(temp1);

		var temp2 = document.createElement("div");
		temp2.className = "rankingScore" + (i+1);
		temp2.innerHTML = "Score: "+ data[keys[i]]["score"];
		temp.appendChild(temp2);

		const tempusername = data[keys[i]]["username"]
		const tempscore = data[keys[i]]["score"]
		
		var temp3 = document.createElement("button");
		temp3.className = "likeButton" + (i+1);
		temp3.innerHTML = "Like";
		temp3.onclick = function () {socket.emit("like", tempusername , tempscore)}
		temp3.disabled = username === tempusername;
		temp.appendChild(temp3);
					
		var temp4 = document.createElement("button");
		temp4.className = "dislikeButton" + (i+1);
		temp4.innerHTML = "Dislike";
		temp4.onclick = function () {socket.emit("dislike", tempusername, tempscore)}
		temp4.disabled = username === tempusername;
		temp.appendChild(temp4);
	}
}

function showComment(data)
{
	var keys = Object.keys(data);
	var divTag = document.getElementById("commentSection");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) 
	{

		var temp = document.createElement("div");
		temp.className = "comment";
		divTag.appendChild(temp);
        
		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = data[keys[i]]["message"] + " Said by: "+data[keys[i]]["user"];
		temp.appendChild(temp1);
		
	}
}

function showUsername()
{
	var divTag = document.getElementById("usernameSection");

	divTag.innerHTML = "Welcome back, " + username;
}

function showSelfScore(data)
{
	var divTag = document.getElementById("Score");
	var keys = Object.keys(data);
	score = data[keys[0]]["score"]
	divTag.innerHTML = data[keys[0]]["score"]
}