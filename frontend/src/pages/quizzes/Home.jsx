import { useEffect, useState, useContext } from "react";
import { getQuizzesByCategoryAndDifficulty } from "../../controllers/quizzesController";
import { QuizContext } from "../../contexts/quizContext";
import Quiz from "../../Components/Quiz";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { quizzes, setQuizzes } = useContext(QuizContext);
  const navigate = useNavigate();

  // Loading State
  const [loading, setLoading] = useState(true);

  // Filter States
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // Filter Change Handlers
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(async () => {
      // Check if category and difficulty are selected, if not, pass empty or undefined
      const data = await getQuizzesByCategoryAndDifficulty(category || '', difficulty || ''); // Allow empty strings for no filter
      setQuizzes(data);
      setLoading(false);
    }, 500);
  }, [category, difficulty]);  // Trigger effect when filters change
  
  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <section className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">Quizzes</h1>

      {/* Filter UI */}
      <div className="flex justify-center space-x-6 mb-6">
        <div>
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category:</label>
          <select id="category" value={category} onChange={handleCategoryChange} className="mt-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Categories</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Tech">Technology</option>
            <option value="Games">Games</option>
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-lg font-medium text-gray-700">Difficulty:</label>
          <select id="difficulty" value={difficulty} onChange={handleDifficultyChange} className="mt-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-blue-600"></i>
        </div>
      )}

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quizzes &&
          quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <Quiz quiz={quiz} onStartQuiz={startQuiz} highscore={quiz.highscore}>
                {/* You can add other elements inside here if needed */}
              </Quiz>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Home;
