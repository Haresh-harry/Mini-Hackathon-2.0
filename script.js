let player1Score = 0;
let player2Score = 0;
let isPlayer1Turn = true;

let player1;
let player2;

let count = 0;
let index = 0;
let allQuestions = [];

const displayPlayer1 = document.getElementById('s2-player1');
const displayPlayer2 = document.getElementById('s2-player2');

const currentTurn = document.getElementById('currentTurn');
const winner = document.getElementById('displayWinner');

const fetchingQuestions = document.getElementById('fetchQuestions');
const displayQuestions = document.getElementById('fetchQuestions');

// submit button function
document.getElementById('submitBtn').addEventListener('click', function() {
    player1 = document.getElementById('s1-player1').value || 'Player1';
    player2 = document.getElementById('s1-player2').value || 'Player2';

    document.getElementById('playerSetupSection').style.display = "none";
    document.getElementById('categorySelectionSection').style.display = "block";

    displayPlayer1.textContent = player1;
    displayPlayer2.textContent = player2;

});

// play button functionality
document.getElementById('play').addEventListener('click', function() {

    // to stop select the categories after all categories are selected
    count++;
    if(count == 9)
    {
        document.getElementById('playAgain').style.pointerEvents = 'none';
        document.getElementById('playAgain').style.opacity = '0.5';
    }

    s2DisplayNames();
    questions();

    console.clear();
});

// back button functionality
document.getElementById('back').addEventListener('click', function() {
    document.getElementById('categorySelectionSection').style.display = "none";
    document.getElementById('playerSetupSection').style.display = "block";
});

// selectCategorySection function to display names and fetch categories
function s2DisplayNames() {

    const categorySelect = document.getElementById('selectCategory');
    
    if(categorySelect) {
        // window.alert('category is selected');
        document.getElementById('categorySelectionSection').style.display = "none";
        document.getElementById('questionDisplaySection').style.display = "block";
    }
    else {
        window.alert('please select a category');
    }
}

// fetching questions function
async function questions() {
    displayQuestions.textContent = '';
    displayQuestions.classList.add('displayQuestions');

    try {
        const dropdown = document.getElementById('selectCategory');
        const category = dropdown.value;
        const selectedIndex = dropdown.selectedIndex;
        dropdown.options[selectedIndex].remove();

        // splitting questions by levels
        const easy = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulty=easy&limit=2`);
        const medium = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulty=medium&limit=2`);
        const hard = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulty=hard&limit=2`);

        // converting the raw data into json format
        const eQue = await easy.json();
        const mQue = await medium.json();
        const hQue = await hard.json();

        // taking all questions into asingle array
        allQuestions = [...eQue, ...mQue, ...hQue];

        showQuestions();
    }
    catch (error) {
        console.error("error occured while fetching", error);
        displayQuestions.textContent = `<h4>You are facing an error please try again..!</h4>`;
    }
}

// show questions function
const showQuestions = () => {
    if (index >= allQuestions.length) {
        return;
    }

    const question = allQuestions[index];
    const options = [question.correctAnswer, ...question.incorrectAnswers].sort(()=>Math.random()-0.5);

    currentTurn.textContent = `Current Turn: ${isPlayer1Turn ? player1 : player2}`;

    // displayQuestions.innerHTML = `
    // <h3>Category: ${question.category}</h3>
    // <h3>Difficulty: ${question.difficulty}</h3>
    // <h3>Question: ${question.question}</h3>
    // ${options.map(option => `
    //     <div>
    //         <input type="radio" name="question" value="${option}">
    //         <label>${option}</label>
    //     </div>
    //     `).join('')}
    // `;

// this code is for use instead of text content

    fetchingQuestions.textContent = '';

    const show1 = document.createElement('h3');
    show1.textContent = `Category: ${question.category}`;
    
    const show2 = document.createElement('h3');
    show2.textContent = `Difficulty: ${question.difficulty}`;
    
    const show3 = document.createElement('h3');
    show3.textContent = `Question: ${question.question}`;

    fetchingQuestions.appendChild(show1);
    fetchingQuestions.appendChild(show2);
    fetchingQuestions.appendChild(show3);
    
    options.forEach(option => {
        const show4 = document.createElement('div');
        
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'question';
        radioInput.value = option;
    
        const label = document.createElement('label');
        label.textContent = option;

        show4.appendChild(radioInput);
        show4.appendChild(label);
        fetchingQuestions.appendChild(show4);

        fetchingQuestions.style.fontSize = '15px';
        fetchingQuestions.style.textAlign = 'left';
    });
    
}

// next button
document.getElementById('next').addEventListener('click', function() {

    const selectedOption = document.querySelector('input[name="question"]:checked');
    if (!selectedOption) {
        alert("Please select an option!");
        return;
    }

    if(index >= allQuestions.length) {
        document.getElementById('questionDisplaySection').style.display = "none";
        document.getElementById('gamePlaySection').style.display = "block";

        document.getElementById('s4-player1').textContent = player1;
        document.getElementById('s4-player2').textContent = player2;

        displayWinner();
        return;
    }

    score(selectedOption, allQuestions[index]);
    index++;
    isPlayer1Turn = !isPlayer1Turn;
    showQuestions();
});

// scoring function
const score = (selectedOption, currentQuestion) => {
    let value = 0;
    if(selectedOption.value === currentQuestion.correctAnswer) {
        switch (currentQuestion.difficulty) {
            case "easy":
                value = 10;
                break;
            case "medium":
                value = 15;
                break;
            case "hard":
                value = 20;
                break;
        }

        if(isPlayer1Turn) {
            player1Score += value;
        }
        else {
            player2Score += value;
        }
        console.log("right answer..!");
    }
    else {
        console.log("wrong answer..!");
    }
};

// display winner function
const displayWinner = () => {

    // let resultMessage = `<h1>Game Over!</h1>`;
    // resultMessage += `<h3>${player1} <=> ${player2}</h3>`;
    // resultMessage += `<h3>${player1Score} <=> ${player2Score}</h3>`;
    // if (player1Score > player2Score) {
    //     resultMessage += `<h1>Winner: ${player1}</h1>`;
    // } else if (player2Score > player1Score) {
    //     resultMessage += `<h1>Winner: ${player2}</h1>`;
    // } else {
    //     resultMessage += `<h1>It's a Tie!</h1>`;
    // }
    // winner.innerHTML = resultMessage;
    // winner.style.fontSize = "15px";

    let demo = document.createElement('h3');
    demo.textContent = 'Game Over !';
    
    let demo1 = document.createElement('h4');
    demo1.textContent = player1 + ' : ' + player2;

    let demo2 = document.createElement('h4');
    demo2.textContent = player1Score + ' : ' + player2Score;

    let demo3 = document.createElement('h2');

    if (player1Score > player2Score) {
        demo3.textContent = `Winner: "${player1}"`;
    } else if (player2Score > player1Score) {
        demo3.textContent = `Winner: "${player2}"`;
    } else {
        demo3.textContent = `It's a Tie!`;
    }

    winner.appendChild(demo);
    winner.appendChild(demo1);
    winner.appendChild(demo2);
    winner.appendChild(demo3);
}

// play again functionality
document.getElementById('playAgain').addEventListener('click', function() {
    document.getElementById('gamePlaySection').style.display = "none";
    document.getElementById('categorySelectionSection').style.display = "block";

    index = 0;
    isPlayer1Turn = true;
    displayQuestions.textContent = '';
    currentTurn.textContent = '';
    winner.textContent = '';
});

// end button functionality
document.getElementById('end').addEventListener('click', function() {
    document.getElementById('gamePlaySection').style.display = "none";
    document.getElementById('resultSection').style.display = "block";
    console.clear();
});

// exit button functionality
document.getElementById('exit').addEventListener('click', function() {
    location.reload();
});
