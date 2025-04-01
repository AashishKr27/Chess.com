# Chess.com Clone - Real-Time Multiplayer Chess Game

A real-time multiplayer chess game clone inspired by Chess.com, built with Node.js, Express, and Socket.io for seamless gameplay between two players.

## Features

- 🏁 Real-time multiplayer gameplay using WebSockets
- ♟️ Full chess rules implementation using `chess.js`
- ⚪⚫ Player role assignment (white/black)
- 👀 Spectator mode for additional connections
- 🔄 Automatic board flipping for the black player
- 📱 Responsive design with Tailwind CSS
- 🎨 Unicode chess pieces with proper styling

## Technologies Used

- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.io
- **Chess Logic**: chess.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Templating**: EJS
- **Styling**: Tailwind CSS

## Installation

### Clone the repository:

```bash
git clone https://github.com/your-username/chess-com-clone.git
cd chess-com-clone
```

### Install dependencies:

```bash
npm install
```

### Start the server:

```bash
node app.js
```

### Open your browser and navigate to:

```
http://localhost:3000
```

## Project Structure

```
chess-com-clone/
├── public/
│   └── js/
│       └── chessgame.js       # Client-side chess logic
├── views/
│   └── index.ejs              # Main game view
├── app.js                     # Server application
├── package.json               # Project dependencies
└── README.md                  # This file
```

## How It Works

### Player Connection:

- First two connections are assigned as white and black players
- Subsequent connections are spectators
- Players can only move when it's their turn

### Game Logic:

- Server maintains the game state using `chess.js`
- All moves are validated server-side
- Board state is synchronized across all clients

### Real-time Updates:

- `Socket.io` handles all real-time communication
- Moves are broadcast to all connected clients
- Board automatically updates for all players/spectators

## Future Improvements

- User authentication system
- Game history and move tracking
- Chat functionality between players
- Game timer/clock
- Multiple concurrent games
- Move validation feedback
- Game analytics

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

- `chess.js` for the chess logic implementation
- `Socket.io` for real-time communication
- `Tailwind CSS` for utility-first styling

Enjoy the game! ♟️
