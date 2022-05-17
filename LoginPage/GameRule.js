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
		temp1.className = "rankingUser";
		temp1.innerHTML = data[keys[i]]["username"];
		temp.appendChild(temp1);

		var temp1 = document.createElement("div");
		temp1.className = "rankingScore";
		temp1.innerHTML = "Score: "+data[keys[i]]["score"];
		temp.appendChild(temp1);
		
	}
}
