const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// Render the chessboard
const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = ""; // Clear previous board
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div"); // Creating a square
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark" // Adding light/dark class
            );
            squareElement.dataset.row = rowIndex; // Storing row index
            squareElement.dataset.col = squareIndex; // Storing column index

            // Handling square click
            if(square) {
                const pieceElement = document.createElement("div"); // Creating a piece
                pieceElement.classList.add("piece", square.color === 'w' ? "white" : "black"); // Adding piece class
                pieceElement.innerHTML = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color; // Allow dragging only for the player's pieces

                // Handling piece movement
                pieceElement.addEventListener("dragstart", (e) => {
                    if(pieceElement.draggable) {
                        draggedPiece = pieceElement; // Set the dragged piece
                        sourceSquare = {row: rowIndex, col: squareIndex}; // Set the source square
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                // Handling piece drop
                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null; // Clear dragged piece on drag end
                    sourceSquare = null; // Clear source square on drag end
                });

                // Append piece to square
                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover" ,(e) => {
                e.preventDefault(); // Allow dropping on the square
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if(draggedPiece){
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare, targetSource);
                }
            });

            // Append the board to the chessboard element
            boardElement.appendChild(squareElement);
        });
    });

    if(playerRole === 'b') {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped")
    }
};

// Handle move function
const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q",
    };
    socket.emit("move", move); // Emit the move to the server
};


// Generate the piece unicode
const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "\u2659",  // Black pawn
        r: "♜",  // Black rook
        n: "♞",  // Black knight
        b: "♝",  // Black bishop
        q: "♛",  // Black queen
        k: "♚",  // Black king
        P: "k",  // White pawn
        R: "♖",  // White rook
        N: "♘",  // White knight
        B: "♗",  // White bishop
        Q: "♕",  // White queen
        K: "♔",  // White king
    }
    return unicodePieces[piece.type] || "";
};

socket.on("playerRole", (role) => {
    playerRole = role; // Set the player role (white/black)
    renderBoard(); // Render the board with player controls
});

socket.on("spectatorRole", () => {
    playerRole = null; // Set the spectator role
    renderBoard(); // Render the board without player controls
});

socket.on("boardState", (fen) => {
    chess.load(fen); // Load the board state from the server
    renderBoard(); // Render the board with the updated state
});

socket.on("move", (move) => {
    chess.move(move); // Load the board state from the server
    renderBoard(); // Render the board with the updated state
});

renderBoard();