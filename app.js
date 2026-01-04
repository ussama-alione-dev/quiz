const quizData = {
    arrays: [
        { q: "Which property is used to get the size of an array?", options: ["arr.length", "arr.size", "arr.count", "arr.len"], correct: 0 },
        { q: "Which method adds an element to the END of an array?", options: ["unshift()", "pop()", "push()", "shift()"], correct: 2 },
        { q: "What is the index of the first element in an array?", options: ["1", "0", "-1", "null"], correct: 1 },
        { q: "How do you check if a variable is an array?", options: ["typeof arr === 'array'", "Array.isArray(arr)", "arr.type === 'array'", "is_array(arr)"], correct: 1 }
    ],
    functions: [
        { q: "Which keyword is used to define a function?", options: ["func", "def", "function", "method"], correct: 2 },
        { q: "What is the correct syntax for an Arrow Function?", options: ["() => {}", "-> {}", "func => {}", "=> {}"], correct: 0 },
        { q: "What does the 'return' keyword do?", options: ["Stops the loop", "Restarts the function", "Outputs a value from the function", "Prints to console"], correct: 2 }
    ],
    loops: [
        { q: "Which loop is guaranteed to run at least once?", options: ["for", "while", "do...while", "foreach"], correct: 2 },
        { q: "Which statement stops a loop immediately?", options: ["stop", "return", "exit", "break"], correct: 3 },
        { q: "Correct syntax for a standard 'for' loop?", options: ["for(i=0; i<5; i++)", "for(i to 5)", "loop(i=0; i<5)", "while(i<5)"], correct: 0 }
    ],
    conditions: [
        { q: "What does '===' check in JavaScript?", options: ["Only Value", "Only Type", "Value and Type", "Memory Reference"], correct: 2 },
        { q: "Which block runs if the 'if' condition is false?", options: ["then", "else", "switch", "stop"], correct: 1 },
        { q: "Which operator is known as the Ternary Operator?", options: ["??", "||", "?:", "&&"], correct: 2 }
    ],
    objects: [
        { q: "How do you access the property 'age' of object 'person'?", options: ["person->age", "person.age", "person(age)", "person[age]"], correct: 1 },
        { q: "Which symbol wraps an Object?", options: ["[]", "()", "{}", "<>"], correct: 2 },
        { q: "Which keyword removes a property from an object?", options: ["remove", "delete", "clear", "pop"], correct: 1 }
    ]
};

let currentCategory = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
const TIME_PER_QUESTION = 15;

const categoriesScreen = document.getElementById('categories-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const timeDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
const nextBtn = document.getElementById('next-btn');

const savedHighScore = localStorage.getItem('jsQuizHighScore');
if (savedHighScore) {
    highScoreDisplay.innerText = savedHighScore;
}

function startQuiz(category) {
    categoriesScreen.classList.remove('active');
    quizScreen.classList.add('active');

    currentCategory = quizData[category];
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.innerText = score;
    document.getElementById('category-title').innerText = category.toUpperCase();

    showQuestion();
}

function showQuestion() {
    clearInterval(timer);
    timeLeft = TIME_PER_QUESTION;
    timeDisplay.innerText = timeLeft;
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = ''; 

  
    timeDisplay.parentElement.style.borderColor = "#FFD700"; 

    const q = currentCategory[currentQuestionIndex];
    questionText.innerText = q.q;

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.classList.add('option-btn');
        btn.setAttribute('onclick', `checkAnswer(this, ${index})`);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.innerText = timeLeft;
        
        if(timeLeft < 5) {
            timeDisplay.parentElement.style.borderColor = "#e74c3c";
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            disableOptions();
            highlightCorrectAnswer();
            nextBtn.classList.remove('hidden');
        }
    }, 1000);
}

function checkAnswer(selectedBtn, selectedIndex) {
    clearInterval(timer);
    const correctIndex = currentCategory[currentQuestionIndex].correct;

    disableOptions();

    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        score++;
        scoreDisplay.innerText = score;
    } else {
        selectedBtn.classList.add('incorrect');
        highlightCorrectAnswer();
    }

    nextBtn.classList.remove('hidden');
}

function disableOptions() {
    const options = optionsContainer.children;
    for (let i = 0; i < options.length; i++) {
        options[i].setAttribute('disabled', 'true');
        options[i].style.cursor = 'no-drop';
        options[i].style.opacity = '0.7';
    }
}

function highlightCorrectAnswer() {
    const correctIndex = currentCategory[currentQuestionIndex].correct;
    optionsContainer.children[correctIndex].classList.add('correct');
    optionsContainer.children[correctIndex].style.opacity = '1';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentCategory.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = currentCategory.length;

    const currentHighScore = localStorage.getItem('jsQuizHighScore') || 0;
    if (score > currentHighScore) {
        localStorage.setItem('jsQuizHighScore', score);
        highScoreDisplay.innerText = score;
    }
}