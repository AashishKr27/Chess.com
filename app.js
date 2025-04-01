// Setting up the express
const express = require('express');
const app = express();

// Importing required modules or packages
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

// Creating HTTP server
const server = http.createServer(app);

// Setting up socket.io
const io = socket(server);

// Setting up the chess game and some variables
const chess = new Chess();
let players = {};
let currentPlayer = 'w';

// Setting up middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');

// Setting up routes
app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" });
});

// Handling socket events
io.on("connection", ( uniquesocket ) => {
    console.log("Connected");

    // Handling player roles
    if(!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if(!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }

    // Handling player disconnection
    uniquesocket.on("disconnect", () => {
        if(uniquesocket.id === players.white) {
            delete players.white;
        } else if(uniquesocket.id === players.black) {
            delete players.black;
        }
    })

    // Handling moves
    uniquesocket.on("move", ( move ) => {
        try {
            // Handling invalid moves
            if(chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if(chess.turn() === "b" && uniquesocket.id !== players.black) return;

            // Making the valid move and updating the game state
            const result = chess.move(move);
            if(result) {
                currentPlayer = chess.turn(); // Update the current player
                io.emit("move", move);  // Emit the move to all players
                io.emit("boardState", chess.fen()); // Emit the board state to all players
            } else {
                console.log("Invalid move", move);
                uniquesocket.emit("Invalid Move", move); // Emit invalid move to the player who made it
            }
        } catch (error) {
            console.log(error);
            uniquesocket.emit("Invalid move", move);
        }
    });
})

// Running the server
server.listen(3000, () =>{
    console.log("Server is running on port 3000");
});