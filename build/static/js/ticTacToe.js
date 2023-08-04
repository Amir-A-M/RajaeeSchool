/**
 * @overview A Tic Tac Toe game with alpha beta algorithm
 * @author Amir Abbas Mousavi <mamyrbas@gmil.com>
 * @link https://github.com/Amir-A-M/TicTacToeGame
*/

const selectorPrefix = '.tic-tac-toe ';

const restart = $(selectorPrefix + '#game-restart'),
    winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],
    message = $(selectorPrefix + ".message"),
    computerMotionDelay = 250;

let
    board = $(selectorPrefix + ".board"),
    cells = $(selectorPrefix + ".cell"),
    emptyCells = 9,
    isGameRunning = true,
    gameMode = '1p',
    human = "x",
    player_2 = "o",
    computer = player_2,
    currentPlayer = human,

    scores = {
        [human]: -1,
        [computer]: 1,
        tie: 0
    };

if (currentPlayer === computer) computerMove();


// https://www.geeksforgeeks.org/event-delegation-in-javascript/
board.click(boardClick);

function boardClick(e) {
    const element = $(e.target);

    if (element.prop("tagName") !== 'LI') return;

    // is game running? || is this fill? || if Computer turn
    if (!isGameRunning || element.data('fill') || (currentPlayer === computer && gameMode === '1p')) return;
    
    message.text('نوبت ' + makeTheName());
    
    emptyCells--;

    fillCell(element);

    GameCondition(currentPlayer, changeUi);
}

function fillCellData(element, character = currentPlayer) {
    element.data("fill", character);
}

function fillCell(element, character = currentPlayer) {
    fillCellData(element, character);
    element.addClass("fill-" + character);
}

// it return's winner name, tie OR false
function GameCondition(character = currentPlayer, Callback) {
    /**
     * winningCondition
     */
    let wc;
    // let turnClass = 'fill-' + character;
    let isWon = winningConditions.some((winningCondition) => {
        let condition = winningCondition.every((i) => {
            return $(cells[i]).data('fill') === character;
        });
        wc = winningCondition;
        return condition;
    });

    let result;
    if (isWon) result = character;
    else if (emptyCells === 0) result = 'tie';
    else result = false;

    if (Callback !== undefined) Callback(wc, character, result);
    return result;

}

// Displays messages, Highlights cells AND Change players' turn
function changeUi(winningCondition, character = currentPlayer, result = GameCondition()) {

    // if somebody won
    if (result !== false && result !== 'tie') {
        winningCondition.forEach((val) => {
            $(cells[val]).addClass("highlight");
        });
        message.text(makeTheName(currentPlayer, true));
        isGameRunning = false;

        // if it's tie
    } else if (result === 'tie') message.text('مساوی');
    else {

        message.text('نوبت ' + makeTheName());
        if (character === human) {
            if (gameMode === '1p') {
                currentPlayer = computer;
                computerMove();
            } else currentPlayer = player_2;

        } else {
            currentPlayer = human;
        }
    }

}

// Computer vs Human    OR     X vs O
function makeTheName(character = currentPlayer, winTitle) {
    if (gameMode === '1p') {
        if (winTitle) {
            return (character === computer) ? 'کامپیوتر برنده شد' : 'شما برنده شدید';
        }
        return (character !== computer) ? 'کامپیوتر' : 'شما';

    } else {
        return (character !== human) ? human : player_2;

    }
}

function cursor(event) {
    cells.each(function () {
        $(this).css('cursor', event);
    });
}


// Restart the game
restart.click(reset);

function reset() {

    // reset Classes   Let User To Click Again
    $(selectorPrefix + '.cell').each(function () {
        $(this).removeClass(['fill-o', 'fill-x', 'highlight'])
            .data('fill', false);
    });

    emptyCells = 9;

    message.text('بازی کن');

    currentPlayer = human;

    isGameRunning = true;
}


// AI
function computerMove() {

    //  When the user is waiting for the computer to move
    cursor('context-menu');

    var alpha = -Infinity,
        beta = Infinity,
        value = -Infinity;

    let nicePlace;

    cells.each(function () {
        const element = $(this);

        // is available?
        if (!element.data('fill')) {

            emptyCells--;
            fillCellData(element);

            value = alphaBeta(cells, false, computer, alpha, beta);

            emptyCells++;
            element.data('fill', false);

            if (value >= beta) return value;

            if (value > alpha) {
                alpha = value;
                nicePlace = element;
            }

        }
    })



    setTimeout(() => {

        // Do the movement
        fillCell(nicePlace);
        emptyCells--;
        GameCondition(currentPlayer, changeUi);
        cursor('pointer');

    }, computerMotionDelay);


}

function alphaBeta(arr, isMaximizing, character, alpha, beta) {

    let result = GameCondition(character);
    if (result !== false) return scores[result];


    if (isMaximizing) {

        let value = -Infinity;

        arr.each(function () {
            const element = $(this);

            if (!element.data('fill')) {

                emptyCells--;
                fillCellData(element);

                value = Math.max(value, alphaBeta(arr, false, computer, alpha, beta));

                emptyCells++;
                element.data('fill', false)


                if (value >= beta) return value;

                alpha = Math.max(alpha, value);

            }
        })
        return value

    }
    else {

        let value = Infinity;

        arr.each(function () {
            const element = $(this);

            if (!element.data('fill')) {

                emptyCells--;
                fillCellData(element, human);

                value = Math.min(value, alphaBeta(arr, true, human, alpha, beta));

                emptyCells++;
                element.data('fill', false)

                if (value <= alpha) return value;

                beta = Math.min(beta, value);

            }
        })
        return value
    }
}
