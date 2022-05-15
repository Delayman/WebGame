window.onload = pageLoad;
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
}

