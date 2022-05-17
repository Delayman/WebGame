window.onload = pageLoad;
// const express = require('express');
// const app = express();
// const fs = require('fs');

function pageLoad()
{
	
	
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error")==1){
		if (window.location.href.split('/').pop()== "register.html"){
			document.getElementById('errordisplay').innerHTML = "Registration Error!"
		}else{
			document.getElementById('errordisplay').innerHTML = "Username or password does not match.";

		}
		
	}

	if(window.location.href.split('/').pop()== "register.html")
	{
		goLogin();
	}else
	{
		goRegister();
	}
}

function goRegister()
{
	var regButton = document.getElementById("goRegister").onclick = function(){
		location.href = "/public/register.html"
	};
}

function goLogin()
{
	var loginButton = document.getElementById("goLogin").onclick = function(){
		location.href = "/public/login.html"
	};
}