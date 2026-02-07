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
    return {
        getGameboard,
    }
}

function Cell() {
    let cellValue = '';
    const changeValue = value => value = cellValue;
    const getValue = () => cellValue;
    return {
        getValue,
        changeValue
    };
}