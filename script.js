// Variables du jeu
let randomNumber; // Variable pour stocker le nombre à deviner
let timeLeft; // Variable pour stocker le temps restant
let initialTimeLeft; // Variable pour stocker le temps initial
let maxRange; // Variable pour stocker la plage maximale du nombre à deviner
let attempts = 0; // Variable pour compter le nombre de tentatives
let timerInterval; // Variable pour stocker l'intervalle du timer
let timerStarted = false; // Variable pour vérifier si le timer a démarré


// Sélection des éléments HTML
const changeLevelBtn   = document.getElementById("change-level-btn"); // Sélection du bouton pour changer de niveau
const levelSelection   = document.getElementById("level-selection"); // Sélectionner la section de sélection de niveau
const gameContainer    = document.getElementById("game-container"); // Sélectionner la section du jeu
const rangeStart       = document.getElementById("range-start"); // Sélectionner le début de la plage de nombres
const rangeEnd         = document.getElementById("range-end"); // Sélectionner la fin de la plage de nombres
const guessInput       = document.getElementById("guess-input"); // Sélectionner le champ de saisie pour deviner
const submitBtn        = document.getElementById("submit-btn"); // Sélectionner le bouton de soumission
const message          = document.getElementById("message"); // Sélectionner le message d'information
const timer            = document.getElementById("timer"); // Sélectionner l'affichage du timer
const resetBtn         = document.getElementById("reset-btn"); // Sélectionner le bouton de réinitialisation

// Fonction pour réinitialiser et retourner au choix du niveau
function changeLevel() {
    // Réinitialiser les variables
    timeLeft = 0; // Réinitialise le temps restant
    timerStarted = false; // Réinitialise l'état du timer
    attempts = 0; // Réinitialise le nombre de tentatives
    randomNumber = null; // Réinitialise le nombre aléatoire à deviner

    // Réinitialiser l'affichage
    guessInput.value = ""; // Effacer le champ de saisie
    message.textContent = ""; // Effacer le message
    timer.textContent = ""; // Effacer le timer
    gameContainer.style.display = "none"; // Cacher la section de jeu
    levelSelection.style.display = "block"; // Afficher la sélection de niveau

    // Réinitialiser les boutons
    resetBtn.style.display = "none"; // Cacher le bouton de réinitialisation
    changeLevelBtn.style.display = "none"; // Cacher le bouton de changement de niveau
    // Réactiver le bouton de soumission et le champ de saisie
    guessInput.disabled = false; // Réactiver le champ de saisie
    submitBtn.disabled = false; // Réactiver le bouton de soumission
}

// fonction endGame pour mettre fin au jeu.
function endGame() {
    submitBtn.disabled = true; // Désactiver le bouton de soumission
    guessInput.disabled = true; // Désactiver le champ de saisie
    resetBtn.style.display = "block"; // Afficher le bouton de réinitialisation
    changeLevelBtn.style.display = "block"; // Afficher le bouton "Changer de niveau"
    clearInterval(timerInterval); // Arrêter le timer
}

// Ajout d'un écouteur d'événements pour le bouton "Changer de niveau"
changeLevelBtn.addEventListener("click", changeLevel); // Lorsque le bouton est cliqué, appeler changeLevel

// Fonction pour démarrer le chronomètre
function startTimer() {
    timer.textContent = timeLeft; // Afficher le temps restant

    timerInterval = setInterval(() => {
        timeLeft--; // Décrémenter le temps restant
        timer.textContent = timeLeft; // Mettre à jour l'affichage du timer

        if (timeLeft <= 0) { // Si le temps est écoulé
            clearInterval(timerInterval); // Arrêter le timer
            message.textContent = `⏳Temps écoulé ! Le nombre était ${randomNumber}.`; // Afficher un message de fin
            endGame(); // Terminer le jeu
        }
    }, 1000); // Répéter toutes les secondes
}

// Fonction pour vérifier la devinette
function checkGuess() {
    const userGuess = parseInt(guessInput.value); // Récupérer la valeur de la devinette

    // Vérifier si la devinette est valide
    if (isNaN(userGuess) || userGuess < 0 || userGuess > maxRange) {
        message.textContent = ` ⚠ Veuillez entrer un nombre valide entre 0 et ${maxRange}.`; // Afficher un message d'erreur
        return; // Sortir de la fonction
    }

    // Démarrer le chronomètre après la première tentative
    if (!timerStarted) {
        timerStarted = true; // Marquer que le timer a démarré
        startTimer(); // Démarrer le timer
    }

    attempts++; // Incrémenter le nombre de tentatives

    // Vérifier si la devinette est correcte
    if (userGuess === randomNumber) {
        if (attempts === 1) { // Vérifier si c'est la première tentative
            message.textContent = `🎉 Incroyable 🎉 ! Vous avez trouvé du premier coup 🎯 ! Le nombre était ${randomNumber} !`; // Message pour le "oneshot"
        } else {
            message.textContent = `🎉 Bravo ! Vous avez deviné le nombre ${randomNumber} en ${attempts} tentatives.`; // Message normal
        }
        clearInterval(timerInterval); // Arrêter le timer
        endGame(); // Terminer le jeu
    } else if (userGuess < randomNumber) { // Si la devinette est trop basse
        message.textContent = "🔼 Plus haut ! "; // Indication pour augmenter la valeur
    } else { // Si la devinette est trop haute
        message.textContent = "🔽 Plus bas ! "; // Indication pour diminuer la valeur
    }

    guessInput.value = ""; // Réinitialiser le champ de saisie
}


// Fonction pour réinitialiser le jeu
function resetGame() {
    randomNumber = Math.floor(Math.random() * (maxRange + 1)); // Générer un nouveau nombre aléatoire
    attempts = 0; // Réinitialiser le nombre de tentatives
    timerStarted = false; // Réinitialiser l'état du timer
    timeLeft = initialTimeLeft; // Réinitialiser le temps restant
    timer.textContent = timeLeft; // Mettre à jour l'affichage du timer
    message.textContent = ""; // Effacer le message
    guessInput.value = ""; // Effacer le champ de saisie
    guessInput.disabled = false; // Réactiver le champ de saisie
    submitBtn.disabled = false; // Réactiver le bouton de soumission
    resetBtn.style.display = "none"; // Cacher le bouton de réinitialisation
    changeLevelBtn.style.display = "none"; // Cacher le bouton "Changer de niveau"
}

// Fonction pour initialiser le jeu selon le niveau sélectionné
function selectLevel(event) {
    const button = event.target; // Récupérer le bouton cliqué
    maxRange = parseInt(button.getAttribute("data-range")); // Récupérer la plage maximale
    initialTimeLeft = parseInt(button.getAttribute("data-time")); // Récupérer le temps initial
    timeLeft = initialTimeLeft; // Initialiser le temps restant
    randomNumber = Math.floor(Math.random() * (maxRange + 1)); // Générer un nouveau nombre aléatoire
    rangeEnd.textContent = maxRange; // Afficher la plage maximale
    timer.textContent = timeLeft; // Afficher le temps restant

    levelSelection.style.display = "none"; // Cacher la sélection de niveau
    gameContainer.style.display = "block"; // Afficher la section de jeu
}

// Écouteurs d'événements pour les boutons de niveau
document.querySelectorAll(".level-btn").forEach((button) => {
    button.addEventListener("click", selectLevel); // Lorsque le bouton est cliqué, appeler selectLevel
});

// Écouteur d'événements pour le bouton de soumission
submitBtn.addEventListener("click", checkGuess); // Lorsque le bouton est cliqué, appeler checkGuess

// Écouteur d'événements pour le bouton de réinitialisation
resetBtn.addEventListener("click", resetGame); // Lorsque le bouton est cliqué, appeler resetGame

// Permettre la validation via la touche "Entrée"
guessInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkGuess(); // Lorsque la touche "Entrée" est pressée, appeler checkGuess
    }
});
