// --- MODULE: INTERFACE WINDOW NAVIGATION ---
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(`${screenName}-screen`).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent.toLowerCase().includes(screenName === 'tictactoe' ? 'tic' : screenName)) {
            btn.classList.add('active');
        }
    });
}

// --- MODULE: TIC-TAC-TOE NEON MATRIX ---
const matrixCells = document.querySelectorAll('.matrix-cell');
const statusDisplay = document.getElementById('status-display');
const resetSystemBtn = document.getElementById('reset-system-btn');

let activePlayer = "X"; 
let gridState = ["", "", "", "", "", "", "", "", ""];
let isMatrixActive = true;

const winFormations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Seed initial player indicator graphics
statusDisplay.innerHTML = `TURN: <span style="color: var(--neon-blue)">PLAYER X</span>`;

function executeCellSelection(e) {
    const targetCell = e.target;
    const arrayIndex = parseInt(targetCell.getAttribute('data-index'));

    if (gridState[arrayIndex] !== "" || !isMatrixActive) return;

    gridState[arrayIndex] = activePlayer;
    targetCell.textContent = activePlayer;
    
    // Wire up hardware neon effects
    if (activePlayer === "X") {
        targetCell.classList.add('claim-x');
    } else {
        targetCell.classList.add('claim-o');
    }

    evaluateMatrixRules();
}

function evaluateMatrixRules() {
    let traceDetected = false;

    for (let i = 0; i < winFormations.length; i++) {
        const [posA, posB, posC] = winFormations[i];
        if (gridState[posA] && gridState[posA] === gridState[posB] && gridState[posA] === gridState[posC]) {
            traceDetected = true;
            break;
        }
    }

    if (traceDetected) {
        const terminalColor = activePlayer === "X" ? "var(--neon-blue)" : "var(--neon-red)";
        statusDisplay.innerHTML = `WINNER: <span style="color: ${terminalColor}; text-shadow: 0 0 10px ${terminalColor}">${activePlayer} SYSTEM OVERRIDE 🎉</span>`;
        isMatrixActive = false;
        return;
    }

    if (!gridState.includes("")) {
        statusDisplay.innerHTML = `<span style="color: #ffffff; text-shadow: 0 0 10px #fff">MATRIX DEADLOCK 🤝</span>`;
        isMatrixActive = false;
        return;
    }

    // Handshake alternative player cycle
    activePlayer = activePlayer === "X" ? "O" : "X";
    const prospectiveColor = activePlayer === "X" ? "var(--neon-blue)" : "var(--neon-red)";
    statusDisplay.innerHTML = `TURN: <span style="color: ${prospectiveColor}">${activePlayer}</span>`;
}

function flushMatrixMemory() {
    activePlayer = "X";
    gridState = ["", "", "", "", "", "", "", "", ""];
    isMatrixActive = true;
    statusDisplay.innerHTML = `TURN: <span style="color: var(--neon-blue)">PLAYER X</span>`;
    matrixCells.forEach(cell => {
        cell.textContent = "";
        cell.className = "matrix-cell"; // Cleans out active node memory styling
    });
}

// Bind interactive event pipelines
matrixCells.forEach(cell => cell.addEventListener('click', executeCellSelection));
resetSystemBtn.addEventListener('click', flushMatrixMemory);
