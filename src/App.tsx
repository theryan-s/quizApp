import React, { useState } from 'react';
import QuestionCard from './Components/QuestionCard';
import { fetchQuizQuestions, Difficulty, QuestionState } from './API'

type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(questions);

  const beginGame = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //User's answer
      const answer = e.currentTarget.value;
      //Check if answer is correct
      const correct = questions[number].correct_answer === answer;
      //Add score if correct
      if (correct) setScore(prev => prev + 1);
      //Save answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
      
    }
  }

  const nextQuestion = () => {
    //To next question if not, the last
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    }
  }

  return (
    <div className="App">
      <h1>Trivia Time!</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
      <button className="start" onClick = {beginGame}>
        Start now!
      </button>
      ) : null}
      {!gameOver ? <p className="score">Score</p> : null} 
      {loading && <p>Loading Questions...</p>}
      {!loading && !gameOver && (<QuestionCard 
        questionNum = {number + 1}
        totalQuestions = {TOTAL_QUESTIONS}
        question = {questions[number].question}
        answers = {questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback = {checkAnswer}
      /> )}
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
      <button className = "next" onClick={nextQuestion}>
        Next Question
      </button> ) : null}
    </div>
  );
}

export default App;
