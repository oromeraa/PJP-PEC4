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
    constructor() {
        this.size = 8;
        this.currentPlayer = 'white';
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
        this.currentPlayer = 'white';
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }
}

// Exercise 2: Board (1.5p)
export class Board {
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

        // está ocupada la casilla de destino?
        if (!this.board.isEmpty(toRow, toCol))
            return false;

        const verticalDir = fromRow - toRow; // +1 arriba, -1 abajo
        const horizontalDir = fromCol - toCol; // +1 izquierda, -1 derecha   

        // es un movimiento simple?
        if (Math.abs(horizontalDir) !== 1 || Math.abs(verticalDir) !== 1)
            return false;

        // es un peón?
        if (!pieceToMove.isKing) {
            // para peones: negras hacia abajo, blancas hacia arriba    
            const pieceVerticalDir = pieceToMove.player === 'black' ? -1 : 1;
            // va en dirección correcta?
            if (verticalDir !== pieceVerticalDir)
                return false;
        }

        // entonces es válido
        return true;
    }

    isValidCapture(fromRow, fromCol, toRow, toCol) {
        const pieceToMove = this.board.getPiece(fromRow, fromCol);

        //// Reciclamos código
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

        // está ocupada la casilla de destino?
        if (!this.board.isEmpty(toRow, toCol))
            return false;

        const verticalDir = fromRow - toRow; // +2 arriba, -2 abajo
        const horizontalDir = fromCol - toCol; // +2 izquierda, -2 derecha  

        // es un salto de 2 casillas?
        if (Math.abs(horizontalDir) !== 2 || Math.abs(verticalDir) !== 2)
            return false;

        // es un peón?
        if (!pieceToMove.isKing) {
            // para peones: negras hacia abajo, blancas hacia arriba
            const pieceVerticalDir = pieceToMove.player === 'black' ? -2 : 2;
            // va en dirección correcta?
            if (verticalDir !== pieceVerticalDir)
                return false;
        }

        // es una ficha en medio y es rival?
        const rivalRow = (fromRow + toRow) / 2;
        const rivalCol = (fromCol + toCol) / 2;
        const pieceToCapture = this.board.getPiece(rivalRow, rivalCol);
        if (pieceToCapture === null || pieceToCapture.player === pieceToMove.player)
            return false;

        // entonces es válido
        return true;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const pieceToMove = this.board.getPiece(fromRow, fromCol);

        if (pieceToMove === null || pieceToMove.player !== this.config.currentPlayer)
            return false;

        const isRegularMove = this.isValidMove(fromRow, fromCol, toRow, toCol);
        const isCaptureMove = this.isValidCapture(fromRow, fromCol, toRow, toCol);

        // es un movimiento válido?
        if (!isRegularMove && !isCaptureMove)
            return false;

        // si es una captura hay que eliminar al ficha rival
        if (isCaptureMove) {
            const rivalRow = (fromRow + toRow) / 2;
            const rivalCol = (fromCol + toCol) / 2;
            this.board.setPiece(rivalRow, rivalCol, null);
        }

        // movemos la ficha a la nueva posición
        this.board.setPiece(toRow, toCol, pieceToMove);

        // eliminamos la ficha de la posición original
        this.board.setPiece(fromRow, fromCol, null);

        // si es un peón que llega al final del tablero, lo promocionamos a dama
        const blackOrigin = 0;
        const whiteOrigin = this.board.size - 1;
        if (pieceToMove.player === 'black' && toRow === whiteOrigin) {
            pieceToMove.promote();
        }
        if (pieceToMove.player === 'white' && toRow === blackOrigin) {
            pieceToMove.promote();
        }

        // cambiamos de turno
        this.config.switchPlayer();

        // comprobamos si el juego ha terminado
        this.checkGameOver();

        return true;
    }

    checkGameOver() {
        let whitePieces = 0;
        let blackPieces = 0;
        let whiteCanMove = false;
        let blackCanMove = false;
        let whiteCanCapture = false;
        let blackCanCapture = false;

        // tengo que crearlas como const para que puedan acceder a this, o crearlas fuera de la función y dentro de la clase.
        // para que no modifique la estructura de la clase, las defino como funciones flecha
        const anyValidMove = (row, col) => {
            return this.isValidMove(row, col, row + 1, col + 1) ||
                this.isValidMove(row, col, row + 1, col - 1) ||
                this.isValidMove(row, col, row - 1, col + 1) ||
                this.isValidMove(row, col, row - 1, col - 1);
        }
        const anyValidCapture = (row, col) => {
            return this.isValidCapture(row, col, row + 2, col + 2) ||
                this.isValidCapture(row, col, row + 2, col - 2) ||
                this.isValidCapture(row, col, row - 2, col + 2) ||
                this.isValidCapture(row, col, row - 2, col - 2);
        }

        for (let row = 0; row < this.board.size; row++) {
            for (let col = 0; col < this.board.size; col++) {
                const piece = this.board.getPiece(row, col);
                if (piece) {
                    if (piece.player === 'white') {
                        whitePieces++;
                        // como gusta la eficiencia, sólo calculamos si puede moverse o capturar si no lo ha hecho antes
                        // solo con que una ficha pueda moverse o capturar, el jugador puede moverse con lo que no está todo perdido
                        if (!whiteCanMove)
                            whiteCanMove = anyValidMove(row, col);
                        if (!whiteCanCapture)
                            whiteCanCapture = anyValidCapture(row, col);
                    } else {
                        blackPieces++;
                        if (!blackCanMove)
                            blackCanMove = anyValidMove(row, col);
                        if (!blackCanCapture)
                            blackCanCapture = anyValidCapture(row, col);
                    }
                }
            }
        }

        // si no hay fichas de un jugador, el otro gana
        if (whitePieces === 0) {
            this.gameOver = true;
            this.winner = 'black';
        } else if (blackPieces === 0) {
            this.gameOver = true;
            this.winner = 'white';
        }
        // si el jugador actual no puede moverse ni capturar, pierde
        else if (this.config.currentPlayer === 'white' && !whiteCanMove && !whiteCanCapture) {
            this.gameOver = true;
            this.winner = 'black';
        } else if (this.config.currentPlayer === 'black' && !blackCanMove && !blackCanCapture) {
            this.gameOver = true;
            this.winner = 'white';
        }
    }
}


export default GameLogic

// Exercise 4.1: UI (2 points)
export class UI {
    constructor(gameLogic, onRestart) {
        this.gameLogic = gameLogic;
        this.gameBoard = document.getElementById('game-board');
        this.onRestart = onRestart;

        this.setupSizeInput();
        this.setupRestartButton();
    }

    // No sé si es la mejor opción pero para poder eliminar el eventListener tal y como se recomienda en la teoría, 
    // lo he definido fuera del setupSizeInput. Si no intentaría eliminar un listener que no se conserva ya que se genera 
    // en cada llamada a setupSizeInput. No coincidirian la refierencia y no haría nada.
    changeSizeEventListener = (event) => {
        const newSize = parseInt(event.target.value);
        // almacenamos el nuevo tamaño del tablero, pero hasta que no se reinicie el juego no se aplica
        this.gameLogic.config.setSize(newSize);
    }

    setupSizeInput() {
        // Clear existing input, but save its value first
        const existingInput = document.getElementById('board-size');
        let controlsDiv = null;
        if (existingInput) {
            existingInput.removeEventListener('change', this.changeSizeEventListener);
            controlsDiv = existingInput.parentElement;
            // controlsDiv.replaceChildren();
        }

        // obtenemos el primer elemnto con la clase container, con el getElementsByName nos devuelve un array. Esto debería ser más eficiente
        const container = document.querySelector('.container');

        // creamos el div de control si no existía antes
        if (!controlsDiv)
            controlsDiv = document.createElement('div');
        controlsDiv.id = 'controls';

        // creamos el input 
        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.id = 'board-size';
        sizeInput.min = '4';
        sizeInput.max = '16';
        sizeInput.value = this.gameLogic.config.size;
        sizeInput.addEventListener('change', this.changeSizeEventListener);

        // creamos el label
        const label = document.createElement('label');
        label.htmlFor = 'board-size';
        label.textContent = 'Board size: ';

        // insertamos el input en el div de control
        controlsDiv.replaceChildren(label, sizeInput);

        // insertamos los controles en el contenedor
        container.appendChild(controlsDiv);
    }

    // Lo mismo que el anterior pero para el botón de reiniciar
    restartEventListener = () => {
        // eliminamos los elementos del tablero
        const gameStatus = document.getElementById('game-status');
        if (gameStatus)
            gameStatus.remove();

        const currentPlayer = document.getElementById('current-player');
        if (currentPlayer)
            currentPlayer.remove();

        // validamos por si no se ha pasado el callback
        if (this.onRestart && typeof this.onRestart === 'function')
            this.onRestart();
    }

    setupRestartButton() {
        // Clear existing button
        let restartButton = document.getElementById('restart');
        if (restartButton) {
            restartButton.removeEventListener('click', this.restartEventListener);
            restartButton.remove();
        }

        restartButton = document.createElement('button');
        restartButton.id = 'restart';
        restartButton.textContent = 'Restart Match';
        restartButton.addEventListener('click', this.restartEventListener);

        document.getElementById('controls').appendChild(restartButton);
    }

    renderBoard() {
        // eliminamos el tablero si existe
        this.gameBoard.replaceChildren();

        // creamos el tablero
        this.gameBoard.classList.add('game-board', 'checkerboard');

        const boardSize = this.gameLogic.config.size;

        // -------------------
        // 
        // Estos ajuste los hago para que le comportamiento sea como el del gif. Hay que limitar el 
        // tamaño máximo de celda para tableros grandes, ya que si no, no caben en el contenedor.
        // En el foro se comenta que no hace falta modificar el css para realizar la práctica pero 
        // la verdad es que no se me ocurre como hacerlo sin tocar el css aunque sea por JS
        const maxBoardSize = 560; // 600px menos el padding
        const cellSize = Math.min(60, Math.floor(maxBoardSize / boardSize));
        this.gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, ${cellSize}px)`;
        this.gameBoard.style.gridTemplateRows = `repeat(${boardSize}, ${cellSize}px)`;
        // -------------------

        // mostramos las casillas
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');

                cell.classList.add('cell');

                // aplicamos el tamaño de celda calculado
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;

                // pintamos las casillas, pares son blancas, impares negras
                if ((row + col) % 2 === 0) cell.classList.add('light');
                else cell.classList.add('dark');

                cell.dataset.row = row;
                cell.dataset.col = col;

                // colocamos las fichas si la hay
                const piece = this.gameLogic.board.getPiece(row, col);
                if (piece) {
                    const pieceDiv = document.createElement('div');
                    pieceDiv.classList.add('piece', piece.player);
                    if (piece.isKing) pieceDiv.classList.add('king');
                    // ajustamos el tamaño de la pieza proporcionalmente
                    const pieceSize = Math.floor(cellSize * 0.8);
                    pieceDiv.style.width = `${pieceSize}px`;
                    pieceDiv.style.height = `${pieceSize}px`;
                    cell.appendChild(pieceDiv);
                }

                // seleccionamos la ficha si la hay
                if (this.gameLogic.selectedPiece && this.gameLogic.selectedPiece.row === row && this.gameLogic.selectedPiece.col === col) {
                    cell.classList.add('selected');
                }

                // agregamos el evento de click
                cell.addEventListener('click', () => {
                    this.handleCellClick(row, col);
                });

                // agregamos la casilla al tablero
                // no uso el replaceChildren porque debo añadir de uno en uno
                this.gameBoard.appendChild(cell);
            }
        }

        this.showCurrentPlayer();
    }

    // Exercise 4.2: UI (1.5 points)
    handleCellClick(row, col) {
        const piece = this.gameLogic.board.getPiece(row, col);
        const selectedPiece = this.gameLogic.selectedPiece;
        // OJO que hay que recordar que selectedPiece almacena las coordenadas de la ficha seleccionada, si no es null

        // si la casilla está vacía no hacemos nada
        if (!selectedPiece && piece) {
            if (piece.player === this.gameLogic.config.currentPlayer) {
                this.gameLogic.selectedPiece = { row, col };
            }
        } else {
            const selectedPieceRow = selectedPiece.row;
            const selectedPieceCol = selectedPiece.col;

            // deseleccionamos la ficha
            if (selectedPieceRow === row && selectedPieceCol === col) {
                this.gameLogic.selectedPiece = null;
            } else {
                // intentamos mover la ficha
                const isMoveValid = this.gameLogic.movePiece(selectedPieceRow, selectedPieceCol, row, col);
                // si lo hemos conseguido la deseleccionamos
                if (isMoveValid) {
                    this.gameLogic.selectedPiece = null;
                }
                // checkeamos después de mover
                if (this.gameLogic.gameOver) {
                    this.showGameStatus(this.gameLogic.winner);
                }
            }
        }

        this.renderBoard();
    }

    showGameStatus(status) {
        // No tiene porque pasar ya que supuestamente es temporal, pero por si lo que fuera existiera lo eliminamos
        let statusDiv = document.getElementById('game-status');
        if (statusDiv) statusDiv.remove();

        statusDiv = document.createElement('div');
        statusDiv.id = 'game-status';
        const winner = status === 'white' ? 'White' : 'Black';
        statusDiv.textContent = `${winner} wins!`;
        this.gameBoard.insertAdjacentElement('afterend', statusDiv);

        setTimeout(() => {
            statusDiv.remove();
        }, 5000);
    }

    showCurrentPlayer() {
        let playerDiv = document.getElementById('current-player');

        // nos permite actualizar el jugador actual, sin tener que crear un nuevo divs
        if (!playerDiv) {
            playerDiv = document.createElement('div');
            playerDiv.id = 'current-player';
            this.gameBoard.insertAdjacentElement('beforebegin', playerDiv);
        }

        const player = this.gameLogic.config.currentPlayer === 'white' ? 'White' : 'Black';
        playerDiv.textContent = `Turn: ${player}`;
    }
}

// Exercise 5: Game (1 point)
export class Game {
    constructor() {
        this.config = null;
        this.board = null;
        this.gameLogic = null;
        this.ui = null;
    }

    start() {
        const boardSizeInput = document.getElementById('board-size');
        // como el restart resetea absolutamente todo, guardamos el valor del input para que no se pierda
        const boardSize = boardSizeInput ? parseInt(boardSizeInput.value, 10) : 8;
        this.config = new GameConfig(); // ya hace el initialize
        this.config.setSize(boardSize);

        this.board = new Board(this.config); // ya hace el generate

        this.gameLogic = new GameLogic(this.board, this.config);

        this.ui = new UI(this.gameLogic, () => this.start());

        this.ui.renderBoard();

        this.gameLogic.checkGameOver();
        if (this.gameLogic.gameOver) {
            this.ui.showGameStatus(this.gameLogic.winner);
        }
    }
}
