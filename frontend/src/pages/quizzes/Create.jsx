import React, { useContext, useState } from "react";
import Alert from "../../Components/Alert";
import { createQuiz } from "../../controllers/quizzesController";
import { QuizContext } from "../../contexts/quizContext";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const { quizzes, setQuizzes } = useContext(QuizContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 0,
    questions: [],
    category: "", // Added category field
    difficulty: "", // Added difficulty field
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", ""],
    answer: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion((prevQuestion) => {
      const newOptions = [...prevQuestion.options];
      newOptions[index] = value;
      return { ...prevQuestion, options: newOptions };
    });
  };

  const addOption = () => {
    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ""],
    }));
  };

  const removeOption = (index) => {
    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: prevQuestion.options.filter((_, i) => i !== index),
    }));
  };

  const addQuestion = () => {
    if (
      currentQuestion.question &&
      currentQuestion.options.every((option) => option) &&
      currentQuestion.answer
    ) {
      setFormData((prevData) => ({
        ...prevData,
        questions: [...prevData.questions, currentQuestion],
      }));
      setCurrentQuestion({
        question: "",
        options: ["", ""],
        answer: "",
      });
      setError(null);
    } else {
      setError("Please fill in all fields for the question.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = await createQuiz(
        formData.name,
        formData.questions,
        formData.description,
        formData.duration,
        formData.category, // Pass category
        formData.difficulty, // Pass difficulty
        user
      );
      setQuizzes([...quizzes, data.quiz]);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="card max-w-lg mx-auto p-8 bg-white shadow-lg rounded-md space-y-6">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Create a New Quiz
      </h1>

      {error && <Alert msg={error} />}

      <form onSubmit={handleCreate} className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Quiz Name"
            className="input"
            value={formData.name}
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
        </div>

        {/* Category and Difficulty Select */}
        <div className="space-y-4">
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

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
          <h2 className="text-lg font-semibold">Add Question</h2>
          <input
            type="text"
            name="question"
            placeholder="Question"
            className="input"
            value={currentQuestion.question}
            onChange={handleQuestionChange}
          />
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="input flex-1"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn-small bg-red-400 hover:bg-red-600 text-white"
                onClick={() => removeOption(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-small bg-blue-500 hover:bg-blue-600 text-white"
            onClick={addOption}
          >
            Add Option
          </button>
          <label className="block mt-4">
            <span className="text-gray-700">Correct Answer</span>
            <select
              name="answer"
              className="input mt-1 block w-full"
              value={currentQuestion.answer}
              onChange={(e) => handleQuestionChange(e)}
            >
              <option value="" disabled>
                Select the correct answer
              </option>
              {currentQuestion.options.map((option, index) => (
                <option key={index} value={option}>
                  {`Option ${index + 1}: ${option}`}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="btn w-full bg-green-500 hover:bg-green-600 text-white mt-4"
            onClick={addQuestion}
          >
            Add Question
          </button>
        </div>

        <div className="questions-list bg-gray-100 p-4 rounded-lg shadow-inner space-y-3">
          <h2 className="text-lg font-semibold">Added Questions</h2>
          {formData.questions.map((q, index) => (
            <div
              key={index}
              className="question-item p-2 bg-white rounded-md shadow-sm"
            >
              <p>
                <strong>Q{index + 1}:</strong> {q.question}
              </p>
              <p>
                <strong>Options:</strong> {q.options.join(", ")}
              </p>
              <p>
                <strong>Answer:</strong> {q.answer}
              </p>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Quiz
        </button>
      </form>
    </section>
  );
};

export default Create;
