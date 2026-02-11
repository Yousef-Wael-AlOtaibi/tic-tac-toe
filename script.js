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

