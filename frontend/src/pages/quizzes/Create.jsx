import React, { useContext, useState } from "react";
import Alert from "../../Components/Alert";
import { createQuiz } from "../../controllers/quizzesController";
import { QuizContext } from "../../contexts/quizContext";
import { useNavigate } from "react-router-dom";

const Create = () => {

  const {quizzes, setQuizzes} = useContext(QuizContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    questions: [],
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
    
    try{
        //Create a new quiz
        const data = await createQuiz(formData.name, formData.questions, formData.description);
        // Update quizzes state
        setQuizzes([...quizzes, data.quiz]);
        // Navigate to dashboard
        navigate("/dashboard");
        console.log(data);
    }
    catch(error){
        setError(error.message);
    }
  };

  return (
    <section className="card">
      <h1 className="title">Create a new Quiz</h1>

      { error && <Alert msg={error} /> }

      <form onSubmit={handleCreate}>
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

        <div className="question-form">
          <input
            type="text"
            name="question"
            placeholder="Question"
            className="input"
            value={currentQuestion.question}
            onChange={handleQuestionChange}
          />
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="input"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <button type="button" className="btn-small" onClick={() => removeOption(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn-small" onClick={addOption}>
            Add Option
          </button>
          <input
            type="text"
            name="answer"
            placeholder="Correct Answer (Option number)"
            className="input"
            value={currentQuestion.answer}
            onChange={handleQuestionChange}
          />
          <button type="button" className="btn" onClick={addQuestion}>
            Add Question
          </button>
        </div>

        <div className="questions-list">
          <h2>Added Questions:</h2>
          {formData.questions.map((q, index) => (
            <div key={index} className="question-item">
              <p>Question: {q.question}</p>
              <p>Options: {q.options.join(", ")}</p>
              <p>Answer: {q.answer}</p>
            </div>
          ))}
        </div>

        <button type="submit" className="btn">Create Quiz</button>
      </form>
    </section>
  );
};

export default Create;