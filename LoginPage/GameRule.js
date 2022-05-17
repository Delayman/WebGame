function checkCookie()
{
	var username = "";
	if(getCookie("username")==false){
		window.location = "public/login.html";
	}
}

checkCookie();
window.onload = pageLoad;

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function pageLoad()
{
	document.getElementById('postbutton').onclick = getData;
    var img = document.getElementById("Game_Pic");
    var count = document.getElementById("Score");
    var score = 0;
	
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
    }


    readRankingData();
	readComment();
	// readUsername();
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

async function readUsername()
{
	let response = await fetch("/readUsername");
	let content = await response.json();
    let ranking = await showUsername(JSON.parse(content));
	
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

		var temp1 = document.createElement("div");
		temp1.className = "rankingScore" + (i+1);
		temp1.innerHTML = "Score: "+data[keys[i]]["score"];
		temp.appendChild(temp1);
		
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

		// var temp1 = document.createElement("div");
		// temp1.className = "postuser" + (i+1);
		// temp1.innerHTML = ;
		// temp.appendChild(temp1);
		
	}
}

// function showUsername(data){
// var keys = Object.keys(data);
// var divTag = document.getElementById("usernameSection");
// 	let username = getCookie('username');
// 	divTag.innerHTML = "Welcome back, " + data[keys[0]];
// }

function showUsername()
{
	var divTag = document.getElementById("usernameSection");
	let username = getCookie('username');
	divTag.innerHTML = "Welcome back, " + username;
}