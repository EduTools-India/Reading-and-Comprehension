document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    document.querySelectorAll('#languageSelection button').forEach(button => {
        button.addEventListener('click', function() {
            selectLanguage(button.textContent);
        });
    });

    document.querySelectorAll('#levelSelection button').forEach(button => {
        button.addEventListener('click', function() {
            selectLevel(button.textContent);
        });
    });

    // Other event listeners can be added here in a similar fashion
});

let selectedLanguage, selectedLevel, startTime, endTime;
let currentQuestionIndex = 0;
let userAnswers = [];
let data = {};

// Fetching data from the JSON file
fetch('./data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        console.log('Data loaded:', data);
        // Rest of your initialization code
    })
    .catch(error => console.error('Error loading data:', error));

function selectLanguage(language) {
    selectedLanguage = language;
    console.log('Selected Language:', selectedLanguage);
    document.getElementById('languageSelection').style.display = 'none';
    document.getElementById('levelSelection').style.display = 'block';
}

function selectLevel(level) {
    selectedLevel = level;
    console.log('Selected Level:', selectedLevel);
    document.getElementById('levelSelection').style.display = 'none';
    document.getElementById('readingSection').style.display = 'block';

    const passage = data[selectedLanguage][selectedLevel].passage;
    document.getElementById('passageTitle').textContent = `${selectedLanguage} - ${selectedLevel}`;
    document.getElementById('passageText').textContent = passage;

    startTimer();
}

function startTimer() {
    startTime = new Date();
    console.log('Timer started at:', startTime);
}

function stopTimer() {
    endTime = new Date();
    console.log('Timer stopped at:', endTime);
    document.getElementById('readingSection').style.display = 'none';
    document.getElementById('questionSection').style.display = 'block';

    displayQuestion();
}

function displayQuestion() {
    const questionData = data[selectedLanguage][selectedLevel].questions[currentQuestionIndex];
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `
        <p>${questionData.question}</p>
        ${questionData.options.map((option, index) => `
            <label>
                <input type="radio" name="question${currentQuestionIndex}" value="${index}">
                ${option}
            </label>
            <br>
        `).join('')}
    `;

    if (currentQuestionIndex === data[selectedLanguage][selectedLevel].questions.length - 1) {
        document.getElementById('nextQuestionBtn').style.display = 'none';
        document.getElementById('submitAnswersBtn').style.display = 'block';
    } else {
        document.getElementById('nextQuestionBtn').style.display = 'block';
        document.getElementById('submitAnswersBtn').style.display = 'none';
    }
}

function showNextQuestion() {
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (selectedOption) {
        userAnswers.push(parseInt(selectedOption.value));
        currentQuestionIndex++;
        displayQuestion();
    } else {
        alert('Please select an answer before proceeding.');
    }
}

function submitAnswers() {
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (selectedOption) {
        userAnswers.push(parseInt(selectedOption.value));
    } else {
        alert('Please select an answer before proceeding.');
        return;
    }

    const totalQuestions = data[selectedLanguage][selectedLevel].questions.length;
    let correctAnswers = 0;
    data[selectedLanguage][selectedLevel].questions.forEach((question, index) => {
        if (question.correct === userAnswers[index]) {
            correctAnswers++;
        }
    });

    const comprehensionAccuracy = (correctAnswers / totalQuestions) * 100;
    const timeTaken = (endTime - startTime) / 1000 / 60; // time in minutes
    const readingSpeed = (data[selectedLanguage][selectedLevel].passage.split(' ').length / timeTaken).toFixed(2);

    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('readingSpeed').textContent = `Reading Speed: ${readingSpeed} words per minute`;
    document.getElementById('comprehensionAccuracy').textContent = `Comprehension Accuracy: ${comprehensionAccuracy.toFixed(2)}%`;
}

// Back button functions
function goBackToLanguageSelection() {
    console.log('Going back to Language Selection');
    document.getElementById('levelSelection').style.display = 'none';
    document.getElementById('readingSection').style.display = 'none';
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('languageSelection').style.display = 'block';
}

function goBackToLevelSelection() {
    console.log('Going back to Level Selection');
    document.getElementById('readingSection').style.display = 'none';
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('levelSelection').style.display = 'block';
}

function goBackToReadingSection() {
    console.log('Going back to Reading Section');
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('readingSection').style.display = 'block';
}
