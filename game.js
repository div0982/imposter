// ===== GAME STATE =====
let gameState = {
    players: [],
    selectedCategories: [],
    imposterCount: 1,
    timeLimit: null,
    hintsEnabled: false,
    currentWord: "",
    currentCategory: "",
    imposters: [],
    votes: {},
    currentPlayerIndex: 0
};

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ===== SCREEN 1: ADD PLAYERS =====
const playerNameInput = document.getElementById('player-name-input');
const addPlayerBtn = document.getElementById('add-player-btn');
const playerList = document.getElementById('player-list');
const playerCountText = document.getElementById('player-count-text');
const continueToCategoriesBtn = document.getElementById('continue-to-categories');

function updatePlayerCount() {
    const count = gameState.players.length;
    playerCountText.textContent = `${count} player${count !== 1 ? 's' : ''}`;
    continueToCategoriesBtn.disabled = count < 3;
}

function renderPlayerList() {
    playerList.innerHTML = '';
    gameState.players.forEach((player, index) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.innerHTML = `
            <span class="player-name">${index + 1}. ${player}</span>
            <button class="delete-player" data-index="${index}">×</button>
        `;
        playerList.appendChild(playerItem);
    });

    // Attach delete handlers
    document.querySelectorAll('.delete-player').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            gameState.players.splice(index, 1);
            renderPlayerList();
            updatePlayerCount();
        });
    });
}

function addPlayer() {
    const name = playerNameInput.value.trim();

    if (!name) {
        alert('Please enter a player name');
        return;
    }

    if (gameState.players.includes(name)) {
        alert('This player name already exists');
        return;
    }

    if (gameState.players.length >= 20) {
        alert('Maximum 20 players allowed');
        return;
    }

    gameState.players.push(name);
    renderPlayerList();
    updatePlayerCount();
    playerNameInput.value = '';
    playerNameInput.focus();
}

addPlayerBtn.addEventListener('click', addPlayer);
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
});

continueToCategoriesBtn.addEventListener('click', () => {
    showScreen('screen-categories');
    renderCategories();
});

// ===== SCREEN 2: CATEGORY SELECTION =====
const categoryGrid = document.getElementById('category-grid');
const confirmCategoriesBtn = document.getElementById('confirm-categories');
const categoryModal = document.getElementById('category-modal');
const modalCategoryName = document.getElementById('modal-category-name');
const modalWordList = document.getElementById('modal-word-list');
const closeModalBtn = document.getElementById('close-modal');

function renderCategories() {
    categoryGrid.innerHTML = '';

    Object.keys(wordDatabase).forEach(categoryName => {
        const category = wordDatabase[categoryName];
        const isSelected = gameState.selectedCategories.includes(categoryName);

        const card = document.createElement('div');
        card.className = `category-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <span class="category-emoji">${category.emoji}</span>
            <div class="category-name">${categoryName}</div>
            <div class="category-toggle">
                <a href="#" class="preview-link" data-category="${categoryName}">Preview</a>
                <label class="toggle">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} data-category="${categoryName}">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;

        categoryGrid.appendChild(card);
    });

    // Attach toggle handlers
    document.querySelectorAll('.category-card .toggle input').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const category = e.target.dataset.category;
            if (e.target.checked) {
                if (!gameState.selectedCategories.includes(category)) {
                    gameState.selectedCategories.push(category);
                }
            } else {
                gameState.selectedCategories = gameState.selectedCategories.filter(c => c !== category);
            }
            updateCategorySelection();
        });
    });

    // Attach preview handlers
    document.querySelectorAll('.preview-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            showCategoryPreview(category);
        });
    });

    updateCategorySelection();
}

function updateCategorySelection() {
    confirmCategoriesBtn.disabled = gameState.selectedCategories.length === 0;

    // Update card styles
    document.querySelectorAll('.category-card').forEach(card => {
        const toggle = card.querySelector('input[type="checkbox"]');
        if (toggle.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function showCategoryPreview(categoryName) {
    const category = wordDatabase[categoryName];
    modalCategoryName.textContent = `${category.emoji} ${categoryName}`;

    modalWordList.innerHTML = '';
    category.words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        modalWordList.appendChild(li);
    });

    categoryModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
    categoryModal.classList.add('hidden');
});

categoryModal.addEventListener('click', (e) => {
    if (e.target === categoryModal) {
        categoryModal.classList.add('hidden');
    }
});

confirmCategoriesBtn.addEventListener('click', () => {
    showScreen('screen-setup');
    updateImposterRecommendation();
});

// ===== SCREEN 3: GAME SETUP =====
const timeLimitToggle = document.getElementById('time-limit-toggle');
const timePicker = document.getElementById('time-picker');
const hintsToggle = document.getElementById('hints-toggle');
const startGameBtn = document.getElementById('start-game');

function updateImposterRecommendation() {
    const playerCount = gameState.players.length;
    const radio1 = document.querySelector('input[name="imposter-count"][value="1"]');
    const radio2 = document.querySelector('input[name="imposter-count"][value="2"]');

    if (playerCount >= 7) {
        radio2.checked = true;
        gameState.imposterCount = 2;
    } else {
        radio1.checked = true;
        gameState.imposterCount = 1;
    }
}

timeLimitToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        timePicker.classList.remove('hidden');
        gameState.timeLimit = parseInt(document.getElementById('time-select').value);
    } else {
        timePicker.classList.add('hidden');
        gameState.timeLimit = null;
    }
});

document.getElementById('time-select').addEventListener('change', (e) => {
    gameState.timeLimit = parseInt(e.target.value);
});

hintsToggle.addEventListener('change', (e) => {
    gameState.hintsEnabled = e.target.checked;
});

document.querySelectorAll('input[name="imposter-count"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        gameState.imposterCount = parseInt(e.target.value);
    });
});

startGameBtn.addEventListener('click', () => {
    startNewRound();
});

// ===== SCREEN 4: WORD REVEAL FLOW (SMOOTH CARD FLIP) =====
const revealCard = document.getElementById('reveal-card');
const currentPlayerName = document.getElementById('current-player-name');
const cardRegularReveal = document.getElementById('card-regular-reveal');
const cardImposterReveal = document.getElementById('card-imposter-reveal');
const cardSecretWord = document.getElementById('card-secret-word');
const cardImposterHint = document.getElementById('card-imposter-hint');
const nextPlayerBtn = document.getElementById('next-player-btn');

let cardFlipped = false;
let isTransitioning = false;

function startNewRound() {
    // Reset state
    gameState.currentPlayerIndex = 0;
    gameState.votes = {};

    // Select random word
    const wordData = getRandomWord(gameState.selectedCategories);
    gameState.currentWord = wordData.word;
    gameState.currentCategory = wordData.category;

    // Assign imposters randomly
    const shuffledPlayers = [...gameState.players].sort(() => Math.random() - 0.5);
    gameState.imposters = shuffledPlayers.slice(0, gameState.imposterCount);

    // Start reveal flow
    showScreen('screen-reveal');

    // Small delay to ensure screen is visible before setting up card
    setTimeout(() => {
        setupRevealCard();
    }, 100);
}

function setupRevealCard() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // First, reset card to front facing WITHOUT animation
    cardFlipped = false;
    isTransitioning = false;

    // Temporarily disable transition for instant reset
    revealCard.style.transition = 'none';
    revealCard.classList.remove('flipped');

    // Force reflow to apply the transition disable
    void revealCard.offsetWidth;

    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            revealCard.style.transition = '';
        });
    });

    // Hide next button
    nextPlayerBtn.classList.remove('visible');

    // Set player name
    currentPlayerName.textContent = currentPlayer.toUpperCase();

    // Prepare reveal content - set it up BEFORE the flip happens
    const isImposter = gameState.imposters.includes(currentPlayer);

    // Always hide both first
    cardRegularReveal.classList.add('hidden');
    cardImposterReveal.classList.add('hidden');

    if (isImposter) {
        // Show imposter view
        cardImposterReveal.classList.remove('hidden');

        if (gameState.hintsEnabled) {
            const hint = getCategoryHint(gameState.currentCategory);
            cardImposterHint.textContent = `Hint: ${hint}`;
            cardImposterHint.classList.remove('hidden');
        } else {
            cardImposterHint.classList.add('hidden');
        }
    } else {
        // Show regular player view
        cardRegularReveal.classList.remove('hidden');
        cardSecretWord.textContent = gameState.currentWord;
    }
}

function flipCard() {
    if (!cardFlipped && !isTransitioning) {
        cardFlipped = true;
        isTransitioning = true;

        // Add flipped class for smooth animation
        revealCard.classList.add('flipped');

        // Show next player button after flip animation completes
        setTimeout(() => {
            nextPlayerBtn.classList.add('visible');
            isTransitioning = false;
        }, 800); // Match the CSS transition duration
    }
}

function goToNextPlayer() {
    if (isTransitioning) return;

    isTransitioning = true;

    // Fade out the button first
    nextPlayerBtn.classList.remove('visible');

    // Wait for button fade, then flip card back
    setTimeout(() => {
        gameState.currentPlayerIndex++;

        if (gameState.currentPlayerIndex < gameState.players.length) {
            // Set up next player's card
            setupRevealCard();
        } else {
            // All players have seen their roles, go to discussion
            startDiscussion();
        }

        isTransitioning = false;
    }, 300);
}

// Tap to flip
revealCard.addEventListener('click', flipCard);

// Also handle touch for better mobile experience
revealCard.addEventListener('touchend', (e) => {
    e.preventDefault();
    flipCard();
});

// Next player button
nextPlayerBtn.addEventListener('click', goToNextPlayer);

// ===== SCREEN 5: DISCUSSION PHASE =====
const timerDisplay = document.getElementById('timer-display');
const timerValue = document.getElementById('timer-value');
const timerProgress = document.getElementById('timer-progress');
const voteNowBtn = document.getElementById('vote-now');

let timerInterval = null;

function startDiscussion() {
    showScreen('screen-discussion');

    if (gameState.timeLimit) {
        timerDisplay.classList.remove('hidden');
        startTimer(gameState.timeLimit);
    } else {
        timerDisplay.classList.add('hidden');
    }
}

function startTimer(seconds) {
    let remaining = seconds;
    const circumference = 2 * Math.PI * 90; // radius = 90

    updateTimerDisplay(remaining, seconds, circumference);

    timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining, seconds, circumference);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            // Auto-proceed to voting after timer ends
        }
    }, 1000);
}

function updateTimerDisplay(remaining, total, circumference) {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const offset = circumference - (remaining / total) * circumference;
    timerProgress.style.strokeDashoffset = offset;

    // Color changes
    if (remaining <= 10) {
        timerProgress.classList.add('danger');
        timerProgress.classList.remove('warning');
    } else if (remaining <= 30) {
        timerProgress.classList.add('warning');
        timerProgress.classList.remove('danger');
    } else {
        timerProgress.classList.remove('warning', 'danger');
    }
}

voteNowBtn.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    showVoting();
});

// ===== SCREEN 6: VOTING =====
const votingList = document.getElementById('voting-list');
const votesCollected = document.getElementById('votes-collected');
const totalVotes = document.getElementById('total-votes');
const confirmVotesBtn = document.getElementById('confirm-votes');

function showVoting() {
    showScreen('screen-voting');
    renderVotingList();
}

function renderVotingList() {
    votingList.innerHTML = '';
    totalVotes.textContent = gameState.players.length;
    votesCollected.textContent = Object.keys(gameState.votes).length;

    gameState.players.forEach(player => {
        const voteCount = Object.values(gameState.votes).filter(v => v === player).length;

        const card = document.createElement('div');
        card.className = 'vote-card';
        card.innerHTML = `
            <span class="vote-player-name">${player}</span>
            <span class="vote-count">${voteCount} vote${voteCount !== 1 ? 's' : ''}</span>
        `;

        card.addEventListener('click', () => voteForPlayer(player));
        votingList.appendChild(card);
    });

    updateVoteButton();
}

function voteForPlayer(player) {
    // Simple voting - each player gets one vote (for demo, we'll collect all votes at once)
    // In real game, you'd pass device like reveal phase

    // For simplicity, we'll use click-based voting
    const voterId = `vote_${Date.now()}_${Math.random()}`;
    gameState.votes[voterId] = player;

    renderVotingList();
}

function updateVoteButton() {
    const voteCount = Object.keys(gameState.votes).length;
    confirmVotesBtn.disabled = voteCount === 0;
    votesCollected.textContent = voteCount;
}

confirmVotesBtn.addEventListener('click', () => {
    calculateResults();
});

// ===== SCREEN 7: RESULTS =====
const victoryView = document.getElementById('victory-view');
const defeatView = document.getElementById('defeat-view');
const caughtPlayerEl = document.getElementById('caught-player');
const winnerPlayerEl = document.getElementById('winner-player');
const revealedWordVictory = document.getElementById('revealed-word-victory');
const revealedWordDefeat = document.getElementById('revealed-word-defeat');
const playAgainBtn = document.getElementById('play-again');
const mainMenuBtn = document.getElementById('main-menu');

function calculateResults() {
    // Count votes
    const voteCounts = {};
    gameState.players.forEach(player => {
        voteCounts[player] = 0;
    });

    Object.values(gameState.votes).forEach(votedPlayer => {
        voteCounts[votedPlayer]++;
    });

    // Find player with most votes
    let maxVotes = 0;
    let eliminatedPlayer = null;

    Object.entries(voteCounts).forEach(([player, count]) => {
        if (count > maxVotes) {
            maxVotes = count;
            eliminatedPlayer = player;
        }
    });

    // Check if eliminated player is an imposter
    const wasImposter = gameState.imposters.includes(eliminatedPlayer);

    showScreen('screen-results');

    if (wasImposter) {
        // Victory
        victoryView.classList.remove('hidden');
        defeatView.classList.add('hidden');
        caughtPlayerEl.textContent = `${eliminatedPlayer} was the imposter!`;
        revealedWordVictory.textContent = gameState.currentWord;
    } else {
        // Defeat
        victoryView.classList.add('hidden');
        defeatView.classList.remove('hidden');
        const imposterNames = gameState.imposters.join(' and ');
        winnerPlayerEl.textContent = `${imposterNames} fooled you all!`;
        revealedWordDefeat.textContent = gameState.currentWord;
    }
}

playAgainBtn.addEventListener('click', () => {
    startNewRound();
});

mainMenuBtn.addEventListener('click', () => {
    // Reset everything
    gameState = {
        players: [],
        selectedCategories: [],
        imposterCount: 1,
        timeLimit: null,
        hintsEnabled: false,
        currentWord: "",
        currentCategory: "",
        imposters: [],
        votes: {},
        currentPlayerIndex: 0
    };

    playerNameInput.value = '';
    playerList.innerHTML = '';
    updatePlayerCount();

    showScreen('screen-add-players');
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    showScreen('screen-add-players');
    updatePlayerCount();
});
