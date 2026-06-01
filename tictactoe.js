// --- LOGIC STACK DATA REGISTERS ---
const cells = document.querySelectorAll('.matrix-cell');
const statusText = document.getElementById('status-text');
const resetBtn = document.getElementById('reset-btn');

// Scoreboard Trackers
const scoreCardX = document.querySelector('.score-card.player-x');
const scoreCardO = document.querySelector('.score-card.player-o');
const displayX = document.getElementById('score-x');
const displayO = document.getElementById('score-o');
const displayDraws = document.getElementById('score-draws');

let playerWinsX = 0;
let playerWinsO = 0;
let matchDraws = 0;

let currentTurn = "X"; 
let systemGrid = ["", "", "", "", "", "", "", "", ""];
let gridOnline = true;

const strikeVectors = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6]             // Cross
];

// Initialize status string layout
statusText.innerHTML = `SYSTEM IN: <span style="color: var(--neon-cyan)">TURN_X</span>`;

function processCellActivation(e) {
    const node = e.target;
    const targetIdx = parseInt(node.getAttribute('data-index'));

    if (systemGrid[targetIdx] !== "" || !gridOnline) return;

    systemGrid[targetIdx] = currentTurn;
    node.textContent = currentTurn;
    
    if (currentTurn === "X") {
        node.classList.add('x-glow');
    } else {
        node.classList.add('o-glow');
    }

    validateGridState();
}

function validateGridState() {
    let winConfirmed = false;
    let winningCombo = [];

    for (let i = 0; i < strikeVectors.length; i++) {
        const [a, b, c] = strikeVectors[i];
        if (systemGrid[a] && systemGrid[a] === systemGrid[b] && systemGrid[a] === systemGrid[c]) {
            winConfirmed = true;
            winningCombo = strikeVectors[i];
            break;
        }
    }

    if (winConfirmed) {
        // Run sequence changes for the win state
        gridOnline = false;
        highlightWinners(winningCombo);
        
        if (currentTurn === "X") {
            playerWinsX++;
            displayX.textContent = playerWinsX;
            statusText.innerHTML = `<span style="color: var(--neon-cyan); text-shadow: 0 0 10px var(--neon-cyan)">X SYSTEM CRITICAL WIN</span>`;
        } else {
            playerWinsO++;
            displayO.textContent = playerWinsO;
            statusText.innerHTML = `<span style="color: var(--neon-red); text-shadow: 0 0 10px var(--neon-red)">O SYSTEM CRITICAL WIN</span>`;
        }
        return;
    }

    if (!systemGrid.includes("")) {
        matchDraws++;
        displayDraws.textContent = matchDraws;
        statusText.innerHTML = `<span style="color: #ffffff; text-shadow: 0 0 10px #ffffff">MATRIX DEADLOCK DETECTED</span>`;
        gridOnline = false;
        return;
    }

    // Switch dynamic execution phases
    currentTurn = currentTurn === "X" ? "O" : "X";
    
    if (currentTurn === "X") {
        scoreCardX.classList.add('active-turn');
        scoreCardO.classList.remove('active-turn');
        statusText.innerHTML = `SYSTEM IN: <span style="color: var(--neon-cyan)">TURN_X</span>`;
    } else {
        scoreCardO.classList.add('active-turn');
        scoreCardX.classList.remove('active-turn');
        statusText.innerHTML = `SYSTEM IN: <span style="color: var(--neon-red)">TURN_O</span>`;
    }
}

function highlightWinners(comboIndices) {
    comboIndices.forEach(index => {
        cells[index].classList.add('winner-cells');
    });
}

function clearMatrixGrid() {
    currentTurn = "X";
    systemGrid = ["", "", "", "", "", "", "", "", ""];
    gridOnline = true;
    
    // Core Reset Turn Interfaces
    scoreCardX.classList.add('active-turn');
    scoreCardO.classList.remove('active-turn');
    statusText.innerHTML = `SYSTEM IN: <span style="color: var(--neon-cyan)">TURN_X</span>`;
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = "matrix-cell"; 
    });
}

// Bind active interface listeners
cells.forEach(cell => cell.addEventListener('click', processCellActivation));
resetBtn.addEventListener('click', clearMatrixGrid);
