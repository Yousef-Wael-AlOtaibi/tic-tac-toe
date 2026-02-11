function Gameboard() {
    const gameboard = [];
    const rows = 3;
    const columns = 3;
    for(let i = 0; i < rows; i++) {
        const row = [];
        for(let j = 0; j < columns; j++) {
            const cell = Cell();
            row.push(cell);
        }
        gameboard.push(row);
    }
    const getGameboard = () => gameboard;
    const markCell = (cell, value) => {
        cell.changeValue(value);
    }
    const printBoard = () => {
        const boardArray = [];
        gameboard.forEach(row=>{
            row.forEach(column => {
                if(column.getValue()) boardArray.push(column.getValue() + ' ');
                else {
                    boardArray.push('. ');
                }
            });
            boardArray.push('br');
        });
        const boardString = boardArray.join('').replaceAll('br', '\n');
        console.log(boardString);
    }
    return {
        getGameboard,
        markCell,
        printBoard
    }
}

function Cell() {
    let cellValue = '';
    const changeValue = value => cellValue = value;
    const getValue = () => cellValue;
    return {
        getValue,
        changeValue
    };
}

function Player(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;
    return {
        getName,
        getMarker
    };
}

const gameController = (function() {
    let gameboard = Gameboard();
    const player1 = Player('Player 1', 'x');
    const player2 = Player('Player 2', 'o');
    let currentPlayer = player1;
    const players = [player1, player2];

    function checkForRoundEnd(playerName, marker) {
        const boardArray = gameboard.getGameboard();
        const matchCell = cell => cell.getValue() === marker;
        boardArray.forEach(row => {
            if(row.every(matchCell)) {
                console.log(`${playerName} won!`)
            }
        })
    }

    function playTurn(choice = []) {
        const [row, column] = choice;
        const cell = gameboard.getGameboard()[row][column];
        if(cell.getValue()) return;
        gameboard.markCell(cell, currentPlayer.getMarker());
        console.log(`${currentPlayer.getName()} played his turn!`);
        gameboard.printBoard();
        checkForRoundEnd(currentPlayer.getName(), currentPlayer.getMarker());

        currentPlayer = players.find(player => player !== currentPlayer);
    };

    return {
        playTurn,
    }
})();