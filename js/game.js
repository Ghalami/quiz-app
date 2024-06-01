import formatData from "./helper.js";
const level = localStorage.getItem("level") || "medium";
const loader = document.getElementById("loader");
const container = document.getElementById("container");
const questionTex = document.getElementById("question-tex");
const answersList = document.querySelectorAll(".answers-text");
const scoreText = document.getElementById("score-number");
const nextButton = document.getElementById("next-button");
const finishButton = document.getElementById("finish-button");
const questionNumber = document.getElementById("question-number");
const error = document.getElementById("error");
const CORRECT_BONUS = 10;
const URL = `https://opentdb.com/api.php?amount=10&difficulty=${level}&type=multiple`;

let formattedData = null;
let questionIndex = 0;
let correctAnswer = null;
let score = 0;
let isAccepted = true;
const fetchData = async () => {
  try {
    const responce = await fetch(URL);
    const json = await responce.json();
    formattedData = formatData(json.results);
    start();
  } catch {
    loader.style.display = "none";
    error.style.display = "block";
  }
};
const start = () => {
  showQuestion();
  loader.style.display = "none";
  container.style.display = "block";
};
const showQuestion = () => {
  questionNumber.innerText = questionIndex + 1;
  const { question, answers, correctAnswersIndex } =
    formattedData[questionIndex];
  correctAnswer = correctAnswersIndex;
  questionTex.innerText = question;
  answersList.forEach((button, index) => {
    button.innerText = answers[index];
  });
};
const checkAnswer = (event, index) => {
  if (!isAccepted) return;
  isAccepted = false;
  const isCorrect = index === correctAnswer ? true : false;
  if (isCorrect) {
    event.target.classList.add("correct");
    score += CORRECT_BONUS;
    scoreText.innerText = score;
  } else {
    event.target.classList.add("incorrect");
    answersList[correctAnswer].classList.add("correct");
  }
};
const nextHandeler = () => {
  questionIndex++;
  if (questionIndex < formattedData.length) {
    isAccepted = true;
    showQuestion();
    removeClasses();
  } else {
    finishHandeler();
  }
};
const finishHandeler = () => {
  localStorage.setItem("score", JSON.stringify(score));
  window.location.assign("./end.html");
};
const removeClasses = () => {
  answersList.forEach((button) => {
    button.className = "answers-text";
  });
};
window.addEventListener("load", fetchData);
nextButton.addEventListener("click", nextHandeler);
finishButton.addEventListener("click", finishHandeler);
answersList.forEach((button, index) => {
  button.addEventListener("click", (event) => checkAnswer(event, index));
});
