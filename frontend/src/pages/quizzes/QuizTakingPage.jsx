import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllQuestionsOfQuiz } from "../../controllers/quizzesController";
import { updateHighscore } from "../../controllers/usersController";

const QuizTakingPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Fetch quiz and questions
  useEffect(() => {
    const getQuiz = async () => {
      try {
        const data = await getAllQuestionsOfQuiz(id);
        setQuiz(data.quiz);
        setQuestions(Object.values(data.questions));
        if (data.quiz.duration) {
          setTimeLeft(data.quiz.duration * 60); // Convert duration to seconds
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    getQuiz();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && quiz) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !quizFinished) {
      handleSubmit();
    }
  }, [timeLeft, quizFinished, quiz]);

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  // Calculate score
  const calculateScore = () => {
    let totalScore = 0;
    const updatedQuestions = questions.map((question) => {
      const isCorrect = question.answer === selectedAnswers[question._id];
      if (isCorrect) {
        totalScore += 1;
      }
      return { ...question, isCorrect };
    });
    setQuestions(updatedQuestions);
    return totalScore;
  };

  // Submit quiz
  const handleSubmit = async () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setQuizFinished(true);

    try {
      await updateHighscore(id, calculatedScore);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  // Navigate to a specific question
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Generate clickable question numbers
  const renderQuestionNumbers = () => {
    return (
      <div className="flex justify-center space-x-4 mt-4">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`py-2 px-4 rounded-full text-lg font-semibold ${
              currentQuestionIndex === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-blue-400 hover:text-white transition-colors`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  if (!quiz) return <p className="text-center text-gray-500 mt-8">Loading quiz...</p>;

  if (quizFinished)
    return (
      <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Quiz Finished!</h1>
        <p className="text-2xl text-green-600 font-bold">
          Your Score: {score}/{questions.length}
        </p>
        <p className="mt-4 text-gray-700">Here's how you did:</p>

        <div className="mt-6 space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className={`p-4 rounded-md shadow-md ${question.isCorrect ? "bg-green-100" : "bg-red-100"}`}
            >
              <p className="text-lg font-medium text-gray-700">
                <span className="font-bold">Q{index + 1}:</span> {question.question}
              </p>
              <p className="mt-2">
                <span
                  className={`font-semibold ${question.isCorrect ? "text-green-600" : "text-red-600"}`}
                >
                  {question.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </p>
              {!question.isCorrect && (
                <p className="mt-2 text-gray-700">
                  <span className="font-bold">Correct Answer:</span>{" "}
                  {question.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">{quiz.quizName}</h1>
      <p className="text-center text-xl text-red-600 font-bold mb-6">
        Time Left: <span className="font-mono">{formatTime(timeLeft)}</span>
      </p>

      <div className="mb-8 p-4 bg-white shadow-md rounded-md">
        <p className="text-lg font-medium text-gray-700 mb-4">
          <span className="font-bold">Q{currentQuestionIndex + 1}:</span> {currentQuestion.question}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options &&
            currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                className={`py-2 px-4 rounded-md font-semibold 
                  ${selectedAnswers[currentQuestion._id] === option
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"} 
                  hover:bg-blue-400 hover:text-white transition-colors`}
              >
                {option}
              </button>
            ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => goToQuestion(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className={`py-2 px-4 rounded-md text-lg font-bold ${
            currentQuestionIndex === 0 ? "bg-gray-300 text-gray-500" : "bg-blue-500 text-white"
          } hover:bg-blue-400 hover:text-white transition-colors`}
        >
          Previous
        </button>
        <button
          onClick={() => goToQuestion(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`py-2 px-4 rounded-md text-lg font-bold ${
            currentQuestionIndex === questions.length - 1
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white"
          } hover:bg-blue-400 hover:text-white transition-colors`}
        >
          Next
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="py-2 px-6 bg-green-500 text-white rounded-md text-lg font-bold hover:bg-green-600 transition-colors"
        >
          Submit Quiz
        </button>
      </div>

      {renderQuestionNumbers()} {/* Render question numbers */}
    </div>
  );
};

export default QuizTakingPage;
