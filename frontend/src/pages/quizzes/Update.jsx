import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "../../Components/Alert";
import { getQuizById, updateQuiz } from "../../controllers/quizzesController";
import { QuizContext } from "../../contexts/quizContext";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, setQuizzes } = useContext(QuizContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 0,
    questions: [],
    category: "",
    difficulty: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await getQuizById(id);
        setFormData({
          quizName: quiz.quizName,
          description: quiz.description,
          duration: quiz.duration,
          category: quiz.category,
          difficulty: quiz.difficulty,
          questions: quiz.questions,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz data.");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[index][field] = value;
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex].options[optionIndex] = value;
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (questionIndex, value) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex].answer = value;
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const addOption = (questionIndex) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      // Ensure we're adding only one option
      updatedQuestions[questionIndex].options.push("");
      console.log(updatedQuestions);
      return { ...prevData, questions: updatedQuestions };
    });
  };
  

  const removeOption = (questionIndex, optionIndex) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const removeQuestion = (index) => {
    setFormData((prevData) => {
      if (prevData.questions.length > 1) {
        const updatedQuestions = [...prevData.questions];
        updatedQuestions.splice(index, 1);
        return { ...prevData, questions: updatedQuestions };
      }
      return prevData;
    });
  };

  const addQuestion = (index) => {
    setFormData((prevData) => {
        const updatedQuestions = [...prevData.questions];
        updatedQuestions.push({ question: "", options: ["", "", ""], answer: "" });
        return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedQuiz = await updateQuiz(id, formData.quizName, formData.description, formData.questions, formData.duration, formData.category, formData.difficulty);
      setQuizzes(
        quizzes.map((quiz) => (quiz._id === id ? updatedQuiz : quiz))
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update quiz.");
    }
  };

  return loading ? (
    <p className="text-center">Loading...</p>
  ) : (
    <section className="card max-w-lg mx-auto p-8 bg-white shadow-lg rounded-md space-y-6">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Update Quiz
      </h1>

      {error && <Alert msg={error} />}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Quiz General Information */}
        <div className="space-y-4">
          <input
            type="text"
            name="quizName"
            placeholder="Quiz Name"
            className="input"
            value={formData.quizName}
            onChange={handleInputChange}
            autoFocus
          />
          <textarea
            name="description"
            rows="3"
            placeholder="Description"
            className="input"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
          <input
            type="number"
            name="duration"
            placeholder="Duration in minutes"
            className="input"
            value={formData.duration}
            onChange={handleInputChange}
            min="1"
          />
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-700">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="input"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="History">History</option>
              <option value="Technology">Technology</option>
              <option value="Literature">Literature</option>
              <option value="Games">Games</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-gray-700">
              Difficulty
            </label>
            <select
              name="difficulty"
              id="difficulty"
              className="input"
              value={formData.difficulty}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Difficulty
              </option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
  <h2 className="text-lg font-semibold">Questions</h2>
  {formData.questions.map((question, qIndex) => (
    <div key={qIndex} className="space-y-2 border-b pb-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          className="input flex-1"
          placeholder={`Question ${qIndex + 1}`}
          value={question.question}
          onChange={(e) =>
            handleQuestionChange(qIndex, "question", e.target.value)
          }
        />
        {formData.questions.length > 1 && (
          <button
            type="button"
            className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 ml-2"
            onClick={() => removeQuestion(qIndex)}
          >
            Remove Question
          </button>
        )}
      </div>
      {/* Options */}
      {question.options.map((option, oIndex) => (
        <div key={oIndex} className="flex items-center space-x-2">
          <input
            type="text"
            className="input flex-1"
            placeholder={`Option ${oIndex + 1}`}
            value={option}
            onChange={(e) =>
              handleOptionChange(qIndex, oIndex, e.target.value)
            }
          />
          <button
            type="button"
            className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            onClick={() => removeOption(qIndex, oIndex)}
          >
            Remove
          </button>
        </div>
      ))}
      
      {/* Answer Dropdown */}
      <div>
        <label htmlFor={`answer-${qIndex}`} className="block text-gray-700">
          Correct Answer
        </label>
        <select
          id={`answer-${qIndex}`}
          className="input"
          value={question.answer}
          onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
        >
          <option value="" disabled>Select Answer</option>
          {question.options.map((option, oIndex) => (
            <option key={oIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 mt-2"
        onClick={() => addOption(qIndex)}
      >
        Add Option
      </button>
    </div>
  ))}
  <button
    type="button"
    className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
    onClick={() => addQuestion()}
  >
    Add Question
  </button>
</div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Update Quiz
          </button>
        </div>
      </form>
    </section>
  );
};

export default Update;
