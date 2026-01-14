// Piece class: Represents a piece on the board
// NOTE: This class is already implemented for you. Use it in the Board class.
export class Piece {
    constructor(player, isKing = false) {
        this.player = player; // 'white' or 'black'
        this.isKing = isKing; // boolean
    }

    promote() {
        this.isKing = true;
    }
}

// Exercise 1: GameConfig (1p)
export class GameConfig {

    size;
    currentPlayer;

    constructor() {
        this.initialize();
    }

    setSize(newSize) {
        if (typeof newSize !== 'number') return;

        this.size = Math.floor(newSize);
        if (this.size < 4) this.size = 4;
        if (this.size > 16) this.size = 16;
    }

    getPieceRows() {
        if (this.size <= 7) return 2;
        if (this.size <= 11) return 3;
        return 4;
    }

    initialize() {
        this.size = 8;
        this.currentPlayer = 'white';
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }
}

// Exercise 2: Board (1.5p)
export class Board {

    size;
    board;

    constructor(gameConfig) {
        this.gameConfig = gameConfig;
        this.size = this.gameConfig.size;
        this.board = [];
        this.generate();
    }

    generate() {
        const pieceRows = this.gameConfig.getPieceRows();

        for (let row = 0; row < this.size; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.size; col++) {
                // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
                // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 
                // 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 
                // 3 | 4 | 5 | 6 | 7 | 8 | 9 
                // 4 | 5 | 6 | 7 | 8 | 9 
                // 5 | 6 | 7 | 8 | 9 
                // 6 | 7 | 8 | 9 
                // 7 | 8 | 9 
                // 8 | 9 
                // 9 
                // si la suma par es casilla blanca, si es impar es casilla negra
                if (row < pieceRows && (row + col) % 2 !== 0) {
                    this.setPiece(row, col, new Piece('black'));
                } else if (row >= this.size - pieceRows && (row + col) % 2 !== 0) {
                    this.setPiece(row, col, new Piece('white'));
                } else {
                    this.board[row][col] = null;
                }
            }
        }
    }

    getPiece(row, col) {
        // getPiece should return null for out of bounds
        if (row < 0 || col < 0 || row >= this.size || col >= this.size) {
            return null;
        }
        return this.board[row][col];
    }

    setPiece(row, col, piece) {
        this.board[row][col] = piece;
    }

    isEmpty(row, col) {
        // isEmpty should return true for empty cells
        return this.getPiece(row, col) === null;
    }
}

// TEST Board
// let gameConfig = new GameConfig();
// gameConfig.setSize(4);
// const board = new Board(gameConfig);


// Exercise 3: GameLogic (3p)
class GameLogic {

    board;
    config;
    selectedPiece;
    gameOver;
    winner;

    constructor(board, config) {
        this.board = board;
        this.config = config;
        this.selectedPiece = null;
        this.gameOver = false;
        this.winner = null;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const pieceToMove = this.board.getPiece(fromRow, fromCol);

        // validar si hay ficha en esa casilla seleccionada
        if (pieceToMove === null)
            return false;

        // pertenece al jugador actual?
        if (pieceToMove.player !== this.config.currentPlayer)
            return false;

        // está fuera del tablero?
        if (toRow < 0 || toRow >= this.board.size || toCol < 0 || toCol >= this.board.size)
            return false;

        // es una casilla oscura?
        if ((toRow + toCol) % 2 === 0)
            return false;

        // está libre la casilla de destino?
        if (!this.board.isEmpty(toRow, toCol))
            return false;

        //TODO: validar si es de captura

        // es un movimiento simple?
        const verticalDir = fromRow - toRow; // +1 arriba, -1 abajo
        const horizontalDir = fromCol - toCol; // +1 izquierda, -1 derecha        
        const pieceVerticalDir = pieceToMove.player === 'black' ? -1 : 1; // negras hacia abajo, blancas hacia arriba

        if (Math.abs(horizontalDir) !== 1 || Math.abs(verticalDir) !== 1)
            return false;

        // es un peón?
        if (!pieceToMove.isKing) {
            // va en dirección correcta?
            if (verticalDir !== pieceVerticalDir)
                return false;
        }

        // entonces es válido
        return true;
    }

    isValidCapture(fromRow, fromCol, toRow, toCol) {

    }

    movePiece(fromRow, fromCol, toRow, toCol) {
    }

    checkGameOver() {
    }
}

export default GameLogic

// Exercise 4.1: UI (2 points)
export class UI {
    constructor(gameLogic, onRestart) {
    }

    setupSizeInput() {
    }

    setupRestartButton() {
    }

    renderBoard() {
    }

    // Exercise 4.2: UI (1.5 points)
    handleCellClick(row, col) {
    }

    showGameStatus(status) {
    }

    showCurrentPlayer() {
    }
}

// Exercise 5: Game (1 point)
export class Game {
    constructor() {
    }

    start() {
    }
}
