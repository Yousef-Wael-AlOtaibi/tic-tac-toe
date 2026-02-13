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

    const boardColumns = [[], [], []];
    gameboard.forEach(row => {
        boardColumns[0].push(row[0]);
        boardColumns[1].push(row[1]);
        boardColumns[2].push(row[2]);
    });
    const getBoardColumns = () => boardColumns;

    const boardDiagonals = [[], []];
    gameboard.forEach(row => {
        boardDiagonals[0].push(row[gameboard.indexOf(row)]);
    });
    gameboard.forEach(row => {
        const lastRowIndex = 2;
        boardDiagonals[1].push(row[lastRowIndex-gameboard.indexOf(row)]);
    });
    const getBoardDiagonals = () => boardDiagonals;
    return {
        getGameboard,
        markCell,
        printBoard,
        getBoardColumns,
        getBoardDiagonals
    };
};

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
};

const gameController = (function() {
    let gameboard = Gameboard();
    const player1 = Player('Player 1', 'x');
    const player2 = Player('Player 2', 'o');
    let currentPlayer = player1;
    const players = [player1, player2];
    const feedback = {
        messages: {
            correctFormat: 'The choiceObject param should be formatted as follows:' +
            '\n{' +
            '\n  row: (a whole number in the range [0-2]),' +
            '\n  column: (a whole number in the range [0-2])' +
            '\n}',
            cellAlreadyMarked: 'This cell is already marked.\n' + 
            'Choose another cell.',
        },
        logInvalidChoice: (row = null, column = null) => 
            'The entered choice object: {row: ' + row + ',  column: ' + column + 
            '}, is not a valid choice object.'
    };

    function checkHorizontalWin(marker) {
        let hasWon = false;
        const boardArray = gameboard.getGameboard();
        const matchCell = cell => cell.getValue() === marker;
        boardArray.forEach(row => {
            if(row.every(matchCell)) {
                hasWon = true;
            };
        });
        return hasWon;
    };

    function checkVerticalWin(marker) {
        let hasWon = false;
        const boardColumns = gameboard.getBoardColumns(); 
        const matchCell = cell => cell.getValue() === marker;
        boardColumns.forEach(column => {
            if(column.every(matchCell)) {
                hasWon = true;
            };
        });
        return hasWon;
    };

    function checkDiagonalWin(marker) {
        let hasWon = false;
        const boardDiagonals = gameboard.getBoardDiagonals();
        const matchCell = cell => cell.getValue() === marker;
        boardDiagonals.forEach(diagonal => {
            if(diagonal.every(matchCell)) {
                hasWon = true;
            };
        });
        return hasWon;
    };

    function checkForTie() {
        let isTied = false;
        let fullRows = 0;
        const boardArray = gameboard.getGameboard();
        const checkCellValue = cell => cell.getValue();
        boardArray.forEach(row => {
            if(row.every(checkCellValue)) {
                fullRows++;
            };
        });
        if(fullRows===boardArray.length) {
            isTied = true;
        }
        return isTied;
    };

    function checkForRoundEnd(playerName, marker) {
        if(checkHorizontalWin(marker)) {
            console.log(`${playerName} won horizontally!`)
            return {
                isWinEnding: true,
                winType: 'horizontally',
                playerName
            };
        };
        if(checkVerticalWin(marker)) {
            console.log(`${playerName} won vertically!`);
            return {
                isWinEnding: true,
                winType: 'vertically',
                playerName
            };
        };
        if(checkDiagonalWin(marker)) {
            console.log(`${playerName} won diagonally!`);
            return {
                isWinEnding: true,
                winType: 'diagonally',
                playerName
            };
        };
        if(checkForTie()) {
            console.log('It is a tie!');
            return {
                isWinEnding: false
            };
        };
        return false
    };

    function playTurn(choiceObject = {row: null, column: null}) {
        const {row, column} = choiceObject;
        if(row === null|| column === null || row>2 || row<0 || column>2 
            || column<0) {
            console.log(feedback.logInvalidChoice(row, column));
            console.log(feedback.messages.correctFormat);
            return
        };
        const cell = gameboard.getGameboard()[row][column];
        if(cell.getValue()) {
            console.log(feedback.logInvalidChoice(row, column));
            console.log(feedback.messages.cellAlreadyMarked);
            return;
        };
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