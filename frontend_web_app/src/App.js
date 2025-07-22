import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Returns the winning line if there is a winner, or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Theme (light/dark) support
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Board: 9 squares, game-x or game-o or null
  const [board, setBoard] = useState(Array(9).fill(null));
  // true: X's turn, false: O's turn
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("");
  const [winLine, setWinLine] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const PRIMARY = "#1976d2";
  const SECONDARY = "#ffb300";
  const ACCENT = "#43a047";

  // Reset game state
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus("");
    setWinLine([]);
    setGameOver(false);
  };

  // Update status on board or win changes
  useEffect(() => {
    const winnerInfo = calculateWinner(board);
    if (winnerInfo) {
      setStatus(
        `Winner: ${winnerInfo.winner === "X" ? "Player 1 (X)" : "Player 2 (O)"}`
      );
      setWinLine(winnerInfo.line);
      setGameOver(true);
    } else if (board.every((sq) => sq)) {
      setStatus("It's a draw!");
      setWinLine([]);
      setGameOver(true);
    } else {
      setStatus(
        `Turn: ${xIsNext ? "Player 1 (X)" : "Player 2 (O)"}`
      );
      setWinLine([]);
      setGameOver(false);
    }
  }, [board, xIsNext]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (gameOver || board[idx]) return; // Don't allow after win or re-click
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  // Inline styling for game colors
  const gameColors = {
    "--ttt-primary": PRIMARY,
    "--ttt-secondary": SECONDARY,
    "--ttt-accent": ACCENT,
  };

  return (
    <div className="tic-tac-toe-app" style={gameColors}>
      <div className="ttt-centered-outer">
        <main className="ttt-main">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            style={{ position: "absolute", top: 24, right: 24 }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-status">{status}</div>
          <Board
            squares={board}
            onSquareClick={handleSquareClick}
            winLine={winLine}
            gameOver={gameOver}
          />
          <button className="ttt-reset-btn" onClick={resetGame}>
            Reset Game
          </button>
          <footer className="ttt-footer">
            <span>
              Player 1: <span style={{ color: PRIMARY }}>X</span>{" "}
              &nbsp;|&nbsp; Player 2: <span style={{ color: SECONDARY }}>O</span>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winLine, gameOver }) {
  function renderSquare(i) {
    const isWinning =
      winLine && winLine.length && winLine.indexOf(i) !== -1;
    let markColor = squares[i] === "X" ? "var(--ttt-primary)" :
      squares[i] === "O" ? "var(--ttt-secondary)" : "inherit";
    return (
      <button
        key={i}
        className={
          "ttt-square" +
          (isWinning ? " ttt-square-win" : "") +
          (gameOver && !squares[i] ? " ttt-square-disabled" : "")
        }
        style={{
          color: markColor,
          borderColor: isWinning
            ? "var(--ttt-accent)"
            : "var(--border-color)"
        }}
        onClick={() => onSquareClick(i)}
        aria-label={
          squares[i]
            ? `Square ${i + 1}: ${squares[i]}`
            : `Square ${i + 1}: Empty`
        }
        disabled={gameOver || !!squares[i]}
        tabIndex={0}
      >
        {squares[i]}
      </button>
    );
  }
  // 3x3
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

export default App;
