// Blackjack game

let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
    // 'standButton': true,
};

// Used for disabling the buttons
var btn_deal = document.getElementById("blackjack-deal-button");
var btn_hit = document.getElementById("blackjack-hit-button");
var btn_stand = document.getElementById("blackjack-stand-button");
btn_deal.disabled = true
btn_hit.disabled = false;
btn_stand.disabled = true;

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

// add listener is all in Javascript instead of adding 'onclick' and 'onchange' in html
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        console.log(card);
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
        console.log(YOU['score']);
        btn_stand.disabled = false;
        btn_deal.disabled = true;
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        // `` = these are used for string templating nicer version of string concatination
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();

    }
}

function blackjackDeal() {
    btn_hit.disabled = false;

    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (i=0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (i=0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        // RESET the score internally!!
        YOU['score'] = 0;
        DEALER['score'] = 0;
        // This is only reseting the frontend
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = 'black';
        document.querySelector('#dealer-blackjack-result').style.color = 'black';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = true;
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
    // If Ace == 11 is below 21, add 11. otherwise, add 1.
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }

    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;
    btn_stand.disabled = true;
    btn_hit.disabled = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] == true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(500);
    }

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// compute winner and return who won
// update the wins, losses and draws (incrementing by 1 to add to front-end table)
function computeWinner() {
    let winner;

    if (blackjackGame['turnsOver'] = true) {
        if (YOU['score'] <=21) {
            // condition: You win if.. 'higher score then Dealer' or 'Dealer busts and your 21 or under'
            // || == or in JS
            if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
                blackjackGame['wins']++;
                winner = YOU;
            } else if (YOU['score'] < DEALER['score']){
              blackjackGame['losses']++;
              winner = DEALER;

            } else if (YOU['score'] === DEALER['score']) {
              blackjackGame['draws']++;

            }
        // condition: When user busts but dealer does not
        } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
          blackjackGame['losses']++;
          winner = DEALER;

        // condition: when you AND the dealer both bust
        } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
          blackjackGame['draws']++;
        }
    }
    console.log('winner is', winner);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {

        if (winner === YOU) {
            // #wins comes from the id="wins" in html
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You Win!';
            messageColor = 'lightgreen';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You Lost!';
            messageColor = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
        btn_deal.disabled = false;
    }
}
