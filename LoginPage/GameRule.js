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
    var img = document.getElementById("Game_Pic");
    var count = document.getElementById("Score");
    var score = 0;

	timer = setInterval (UpdateScore, 3000);

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
}

async function readRankingData()
{
	let response = await fetch("/readRanking");
	let content = await response.json();
    let ranking = await showRanking(JSON.parse(content));
	
	
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
		
		var likebottontemp = document.createElement("button");
		likebottontemp.className = "LikeButton"
		likebottontemp.id = i+1;
		likebottontemp.innerHTML = "Like";
		likebottontemp.addEventListener("click",AddLike(this.id))
		temp.appendChild(likebottontemp);
	}
}

async function AddLike(ID)
{
	let getData = await fetch("/readRanking");
	let content = await getData.json();
	let jsonrankdata = JSON.parse(content);
	let jsonkeys = Object.keys(jsonrankdata);
	let username = jsonrankdata[jsonkeys[ID]];
	console.log("ID : "+ID);
	console.log("Json data : "+jsonrankdata);
	console.log("Name : "+username);

	let response = await fetch("/Addlike",{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user:username,
			Like:1})
	});

}