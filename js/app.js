/* ========================
 ! - Important DOM Elements
 ==========================*/
const darkModeToggle = document.querySelector("#chk");
const modalOpenBtn = document.getElementById("condition-modal-btn");
const modalContainer = document.querySelector(".quiz-modal-container");
const modalConditionBox = modalContainer.querySelector(".quiz-modal-condition");
const exitModal = modalConditionBox.querySelector(".exit-modal");
const startQuizBtn = modalConditionBox.querySelector(".start-quiz");
const questionSection = document.querySelector(".question-section");
const questionText = questionSection.querySelector(".question-text");
const questionOptionContainer =
  questionSection.querySelector(".question-options");
const questionProgressText = questionSection.querySelector(
  ".question-progress-text"
);
const timeText = questionSection.querySelector(".time-count");
const nextQuiz = questionSection.querySelector(".next-question");
const scoreElement = questionSection.querySelector(".score");
const timelineElement = questionSection.querySelector(".timeline");
const questionProgressbar = questionSection.querySelector(".question-progress");
const resultSection = document.querySelector(".result-section");
const canvas = document.getElementById("my-canvas");
const resultExpression = resultSection.querySelector(".result-expression");
const resultText = resultSection.querySelector(".result-text");
const resultFeedback = resultSection.querySelector(".feedback");
const restart = resultSection.querySelector(".restart");
const backHome = resultSection.querySelector(".back-to-home");
const loadingContainer = document.querySelector(".loading-container");

/* =====================
 ! - Important Variables - *
 =======================*/
let questionIndex = 0;
let timeCount;
let userScore = 0;
let counter;
let timelineCounter;

/* ===================
 ! - Important Elements - *
 =====================*/

const tick = document.createElement("div");
tick.classList.add("tick-icon");
tick.innerHTML = `<i class="fa-solid fa-check"></i>`;


const cross = document.createElement("div");
cross.classList.add("cross-icon");
cross.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

/* ===================
 ! - Confetti Settings - *
 ====================*/
var confettiSettings = {
  target: "my-canvas",
  max: "250",
  size: "1.8",
  rotate: true,
  clock: "29",
  start_from_edge: true,
};
var confetti = new ConfettiGenerator(confettiSettings);

/* ========================
 ! - Important Functions - *
 ==========================*/

/*
 ! - Modal Open/Close Fuction - *
 */
const modalFunc = (condition) => {
  if (condition === "open") {
    modalConditionBox.classList.add("active");
    document.body.style.overflow = "hidden";
    if (document.body.classList.contains("dark-mode")) {
      modalContainer.classList.add("active-dark");
    } else {
      modalContainer.classList.add("active");
    }
  } else {
    modalConditionBox.classList.remove("active");
    document.body.style.overflow = "auto";
    if (document.body.classList.contains("dark-mode")) {
      modalContainer.classList.remove("active-dark");
    } else {
      modalContainer.classList.remove("active");
    }
  }
};

/*
! - Initial show Function
 */
const initialShowQuestion = () => {

  resultSection.classList.remove("active");
  canvas.style.display = "none";


  questionIndex = 0;
  userScore = 0;
  scoreElement.textContent = userScore;
};

/*
 ! - Show Question Function - *
 */
const showQuestion = () => {

  questionSection.classList.add("active");
  timer();

  timelineFunc();

  if (document.querySelectorAll(".single-option")) {
    document
      .querySelectorAll(".single-option")
      .forEach((element) => element.remove());
  }

  questionText.textContent = `${questionIndex + 1}. ${quizArr[questionIndex].question
    }`;

  const options = quizArr[questionIndex].options;

  for (let option in options) {
    let singleQuestionElement = document.createElement("div");
    singleQuestionElement.classList.add("single-option");
    singleQuestionElement.innerHTML = `
     <span class="single-option-text"> ${option}.  ${options[option]}</span>`;
    singleQuestionElement.addEventListener("click", (e) =>
      selectedAnswer(option, e)
    );
    questionOptionContainer.append(singleQuestionElement);
  }

  questionProgress();
  nextQuiz.style.display = "none";
};

/*
 ! - Timeline Fuction - *
 */
const timelineFunc = () => {
  timelineElement.style.width = `100%`;
  timeText.textContent = 10;

  timelineCounter = setInterval(() => {
    const getTime = Number(timeText.textContent);
    timelineElement.style.width = `${getTime * 10}%`;
  }, 1000);
};

const selectedAnswer = (option, e) => {
  clearInterval(counter);
  clearInterval(timelineCounter);

  const selectedOption = option;
  const correctOption = quizArr[questionIndex].answer;
  if (selectedOption === correctOption) {
    userScore += 5;
    scoreElement.textContent = userScore;
    showIconTick(e, true);
  } else {
    showIconTick(e, false);
    showCorrectAnswer();
  }

  const singleOption = document.querySelectorAll(".single-option");
  singleOption.forEach((element) => element.classList.add("disabled"));
  nextQuizBtnChange();
};

/*
! - Show Icon Tick Function
*/
const showIconTick = (e, isTick) => {
  if (e.target.classList.contains("single-option")) {
    e.target.children[0].insertAdjacentElement(
      "afterend",
      isTick === true ? tick : cross
    );
    e.target.classList.add(isTick === true ? "correct" : "incorrect");
  } else {
    e.target.insertAdjacentElement("afterend", isTick === true ? tick : cross);
    e.target.parentNode.classList.add(
      isTick === true ? "correct" : "incorrect"
    );
  }
};

/*
! - Show Correct Answer Function
*/
const showCorrectAnswer = () => {
  const singleOption = document.getElementsByClassName("single-option");

  const correctOption = quizArr[questionIndex].answer;

  for (let option of singleOption) {
    if (option.textContent.trim().slice(0, 1) == correctOption) {
      option.children[0].insertAdjacentElement("afterend", tick);
      option.classList.add("correct");
    }
    option.classList.add("disabled");
  }
};

/*
! -  Question Progress Function
*/
const questionProgress = () => {
  questionProgressbar.style.width = `${((questionIndex + 1) / quizArr.length) * 100
    }%`;
  questionProgressText.innerHTML = `<span class="bold">${questionIndex + 1
    } </span> of  <span class="bold">${quizArr.length}</span> Questions`;
};

/*
! - Timer Function
*/
const timer = () => {
  timeCount = 10;
  timeText.textContent = timeCount;
  counter = setInterval(() => {
    timeCount--;
    timeText.textContent = timeCount;
    if (timeCount == 0) {
      timeText.textContent = "0" + timeCount;
      timelineElement.style.width = `0%`;
      clearInterval(counter);
      clearInterval(timelineCounter);
      showCorrectAnswer();
      nextQuizBtnChange();
    } else {
      timeText.textContent = "0" + timeCount;
    }
  }, 1000);
};

/*
! - Next Quiz Button Change function
*/
const nextQuizBtnChange = () => {
  nextQuiz.style.display = "block";
  if (questionIndex === quizArr.length - 1) {
    nextQuiz.textContent = "Show Result";
  } else {
    nextQuiz.textContent = "Next Question";
  }
};

/*
! - Show Result Function
*/
const showResult = () => {
  questionSection.classList.remove("active");
  resultSection.classList.add("active");
  canvas.style.display = "block";
  confetti.render();

  if (userScore > 30) {
    resultExpression.textContent = `🎉 Congratulation`;
    resultText.innerHTML = `You got <span class="bold">${userScore}</span> out of <span class="bold">${quizArr.length * 5
      }</span>`;
    resultFeedback.textContent = `You have done a great job!`;
  } else {
    resultExpression.textContent = `😞 Sorry`;
    resultText.innerHTML = `You got <span class="bold">${userScore}</span> out of <span class="bold">${quizArr.length * 5
      }</span>`;
    resultFeedback.textContent = `You have to work hard on your knowledge.`;
  }
};

/* ======================
 ! - Important Event Listeners - *
 ========================*/

/*
! - Dark Mode Functionality
*/
darkModeToggle.addEventListener("click", (e) => {
  if (e.target.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});

/*
! - Modal Open Functionality
*/
modalOpenBtn.addEventListener("click", () => {
  modalFunc("open");
});

/*
! - Modal Close Functionality
*/
exitModal.addEventListener("click", () => {
  modalFunc("close");
});

/*
! - Modal close the functionality, if someone click outside the modal condition box
*/
modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) {
    modalFunc("close");
  }
});

/*
! - Start Quiz Button Functionality
*/
startQuizBtn.addEventListener("click", () => {

  modalFunc("close");


  document.body.classList.add('quiz-active');


  if (questionIndex === 0) {
    loadingContainer.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      loadingContainer.style.display = "none";
      showQuestion();
    }, 2500);
  } else {

    showQuestion();
  }

  scoreElement.textContent = 0;
});

/*
! - Next Quiz Functionality
*/
nextQuiz.addEventListener("click", () => {
  if (questionIndex === quizArr.length - 1) {
    showResult();
  } else {
    questionIndex++;
    showQuestion();
  }
});

/*
! - Restart Event functionality
*/
restart.addEventListener("click", () => {
  document.body.classList.remove('quiz-active');

  initialShowQuestion();


  if (questionIndex === 0) {
    loadingContainer.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      loadingContainer.style.display = "none";
      showQuestion();
    }, 2500);
  } else {

    showQuestion();
  }
});

/*
! - Back To Home Event listener
*/
backHome.addEventListener("click", () => {

  document.body.classList.remove('quiz-active');

  initialShowQuestion();
});
