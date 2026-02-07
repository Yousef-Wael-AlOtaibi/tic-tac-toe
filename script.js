const gameboardObject = (function() {
    const gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const getGameboard = () => gameboard;

    function markBoardCell(marker, rowIndex, columnIndex) {
        gameboard[rowIndex][columnIndex] = marker;
     };

    return {
        getGameboard,
        markBoardCell
    };
})();

function createPlayer(name, marker) {

    return {
        name,
        marker
    }
}