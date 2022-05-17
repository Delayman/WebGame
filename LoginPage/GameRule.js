function checkCookie()
{
	var username = "";
	if(getCookie("username")==false){
		window.location = "public/login.html";
	}
}

checkCookie();
window.onload = pageLoad;
var timer = null;

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
    timer = setInterval (getScore, 3000);

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
    await console.log(content);
}

function getScore()
{
    let clickcount = document.getElementById("Score").value;
    UpdateClickcount(clickcount);
}

async function UpdateScroe();
{
    
}

async function UpdateClickcount(clickcount)
{
    var username = getCookie('username');
	let response = await fetch("/UpdateScore",{
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user:username,
			click:clickcount})
	});
}