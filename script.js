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

function Player(playerName, playerMarker) {
    let name = playerName;
    let marker = playerMarker;
    const getName = () => name;
    const getMarker = () => marker;
    const changeName = (newName) => name = newName || name;
    const changeMarker = (newMarker) => marker = newMarker || marker;
    return {
        getName,
        getMarker,
        changeName,
        changeMarker
    };
};

const gameController = (function() {
    let gameboard = Gameboard();
    const player1 = Player('Player 1', 'x');
    const player2 = Player('Player 2', 'o');
    let currentPlayer = player1;
    const players = [player1, player2];
    let isPlaying = true;
    const feedback = {
        messages: {
            correctFormat: 'The choiceObject param should be formatted as' + 
            ' follows:' +
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

    function checkForRoundEnd(marker) {
        if(checkHorizontalWin(marker)) {
            return {
                endMessage: 'won horizontally',
                isWinEnding: true
            };
        };
        if(checkVerticalWin(marker)) {
            return {
                endMessage: 'won vertically',
                isWinEnding: true
            };
        };
        if(checkDiagonalWin(marker)) {
            return {
                endMessage: 'won diagonally',
                isWinEnding: true
            };
        };
        if(checkForTie()) {
            return {
                endMessage: 'It\'s a tie!',
                isWinEnding: false
            };
        };
        return false
    };

    function playTurn(choiceObject = {row: null, column: null}) {
        if(!isPlaying) {
            return;
        }
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
        const endObject = 
        checkForRoundEnd(currentPlayer.getMarker());

        if(!endObject) {
            currentPlayer = players.find(player => player !== currentPlayer);
            console.log('The game hasn\'t ended.');
            displayController.updateDisplay(currentPlayer.getName() + '\'s turn.');
        }
        else {
            isPlaying = false;
            displayController.disableCells();
            if(endObject.isWinEnding) {
                const message = `${currentPlayer.getName()} ${endObject.endMessage}`;
                console.log(message);
                displayController.updateDisplay(message);
            }
            else {
                console.log(endObject.endMessage);
                displayController.updateDisplay(endObject.endMessage);
            }
        };
        displayController.renderBoard(gameboard.getGameboard());
    };

    function restartGame() {
        console.log('Restarting game...');
        isPlaying = true;
        gameboard = Gameboard();
        currentPlayer = player1;
        displayController.updateDisplay(currentPlayer.getName() + '\'s turn');
        displayController.renderBoard(gameboard.getGameboard());
        gameboard.printBoard();
        displayController.enableCells();
    };

    function changeConfiguration(playersConfig) {
        player1.changeName(playersConfig.player1Name);
        player1.changeMarker(playersConfig.player1Marker);
        player2.changeName(playersConfig.player2Name);
        player2.changeMarker(playersConfig.player2Marker);
    };
    return {
        playTurn,
        restartGame,
        changeConfiguration
    };
})();

const displayController = (function(){ 
    const cells = [...document.querySelectorAll('button.cell')];
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.textContent = '.';
    });

    const display = document.querySelector('#result-display');
    const updateDisplay = text => display.textContent = text;

    const configureButton = document.querySelector('#configure-button');
    const configureDialog = document.querySelector('#configure-dialog');
    const configureForm = document.querySelector('#configure-form');
    configureForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const player1Name = document.querySelector('#player1-name').value;
        const player2Name = document.querySelector('#player2-name').value;
        const player1Marker = document.querySelector('#player1-marker').value;
        const player2Marker = document.querySelector('#player2-marker').value;
        gameController.changeConfiguration({player1Name, player2Name, 
            player1Marker, player2Marker
        });
        configureDialog.close();
    })
    configureButton.addEventListener('click', () => {
        configureDialog.showModal();
    })
    const restartButton = document.querySelector('#restart-button');
    restartButton.addEventListener('click', gameController.restartGame);
    function getBoardValues(boardArr) {
        let valuesArr = [];
        boardArr.forEach(row => {
            row.forEach(cell => {
                valuesArr.push(cell.getValue());
            })
        });
        return valuesArr;
    };

    function renderBoard(boardArr) {
        const valuesArr = getBoardValues(boardArr);
        console.log(valuesArr);
        cells.forEach(cell => {
            cell.textContent = valuesArr[cells.indexOf(cell)] || '.';
        })
    };

    const disableCells = () => cells.forEach(cell => cell.disabled = true);
    const enableCells = () => cells.forEach(cell => cell.disabled = false);

    function handleCellClick(event) {
        const cell = event.target;
        const choiceObject = {
            row: cell.getAttribute('data-row'),
            column: cell.getAttribute('data-column')
        };
        gameController.playTurn(choiceObject);  
    };

    return {
        renderBoard,
        updateDisplay,
        enableCells,
        disableCells
    };
})();