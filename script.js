const winAudio = new Audio('correct-choice-43861.mp3');
const drawAudio = new Audio('scribble_short-104286.mp3');
const gameEndPopup = document.getElementById('end-popup')
const playBtn = document.getElementById('play-btn');
const restartBtn = document.getElementById('restart-btn');
const curntPlrSpan = document.getElementById('current-player');
const endDescriptionText = document.getElementById('end-description');
const gridBtns = document.querySelectorAll('#gameplay > button');
console.log([...gridBtns][0].getBoundingClientRect().top)
const points = () => ({
    
})
function createGameBoard(){
    const grid = ['','','','','','','','',''];
    let rows = () => [[grid[0],grid[3],grid[6]],[grid[1],grid[4],grid[7]],[grid[2],grid[5],grid[8]]];
    let cols = () => [[grid[0],grid[1],grid[2]],[grid[3],grid[4],grid[5]],[grid[6],grid[7],grid[8]]];
    let diags = () => [[grid[0],grid[4],grid[8]],[grid[2],grid[4],grid[6]]];
    // conditions that find three x's vertically aligned
    // if grid = ['','','','','','','','',''] or ['','x','','','x','','','x',''] or ['','','x','','','x','','','x'] it will return true. 
    const rowConditions = (mark)=>[rows()[0].every(cell=>cell===mark),rows()[1].every(cell=>cell===mark),rows()[2].every(cell=>cell===mark)];
    // conditions that find three x's horizontally aligned
    // if grid = ['x','x','x','','','','','',''] or ['','','','x','x','x','','',''] or ['','','','','','','x','x','x'] it will return true.
    const colsConditions = (mark) => [cols()[0].every(cell=>cell===mark),cols()[1].every(cell=>cell===mark),cols()[2].every(cell=>cell===mark)]; 
    // conditions that find three x's diagnolly aligned
    // if grid = ['x','','','','x','','','','x'] or ['','','x','','x','','x','',''] it will return true.
    const diagConditions = (mark) => [diags()[0].every(cell=>cell===mark),diags()[1].every(cell=>cell===mark)];
    const getGrid = () => grid;
    const checkWin = (marker)=>{  
        if(rowConditions(marker).find(cond=>cond===true)){
            return [true,'won vertically'];
        }
        if(colsConditions(marker).find(cond=>cond===true)){
            return [true,'won horizontally'];
        }
        if(diagConditions(marker).find(cond=>cond===true)){
        const diagAngle = ()=>{
            if(diagConditions(marker)[0]) return 45;
            if(diagConditions(marker)[1]) return 130
        };
            return [true,'won diagnolly',diagAngle()];
        }
        if(grid.every(cell=>cell!=='')){
            return [true,'tie'];
        }
        return [false,'keep playing!']
    }
    const placeMarker = (index,marker)=>{
        if(grid[index]){
        console.log('cannot place marker here! try again.');
        return;
    }
        grid[index] = marker;
    }
    return {getGrid,placeMarker,checkWin};
}
function player(name,marker){
    return {name,gameData:{wins:0,losses:0,marker}};
}
const players =  [player('Player1','x'),player('Player2','o')];
function game(){
    winAudio.currentTime = 0;
    const gameBoard = createGameBoard();
    let currentPlayer = players[0];
    curntPlrSpan.textContent = currentPlayer.name
    gridBtns.forEach(btn=>{
        btn.disabled=false;
        btn.textContent='';
        btn.classList = ''});
    gridBtns.forEach(btn=>btn.onclick=e=>{
        e.target.classList.add(currentPlayer.gameData.marker==='x'?'x':'o')
        e.target.disabled = true;
        gameBoard.placeMarker(e.target.value,currentPlayer.gameData.marker);
        e.target.textContent = currentPlayer.gameData.marker;
        console.log(gameBoard.getGrid())
        console.log(currentPlayer.name)
        const [bool,msg]  = gameBoard.checkWin(currentPlayer.gameData.marker);
        if(bool || msg==='tie'){
            //const posX = btn.getBoundingClientRect().x
            let description = msg==='tie'?`It's A Tie!`:`${currentPlayer.name} Wins`
            onGameEnded(description);
            return
        }
        currentPlayer = players.find(plr=>plr!==currentPlayer);
        curntPlrSpan.textContent = currentPlayer.name
    })
}
function showPopup(popup){
    popup.classList.remove('hidden');
}
function hidePopup(popup){
    popup.classList.add('hidden');
    console.log('hiding popup...')
}
function onGameEnded(description){
    winAudio.play();
    gridBtns.forEach(btn=>btn.disabled=true);
    showPopup(gameEndPopup);
    curntPlrSpan.textContent  = 'none'
    endDescriptionText.textContent = description;
}
game();
restartBtn.onclick = ()=>{
    game();
    hidePopup(gameEndPopup);
};