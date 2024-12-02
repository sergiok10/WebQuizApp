import { useEffect, useContext, useState } from "react";
import { getQuizzes, deleteQuiz } from "../../controllers/quizzesController";
import { QuizContext } from "../../contexts/quizContext";
import Quiz from "../../Components/Quiz";
import { Link } from "react-router-dom";
import Alert from "../../Components/Alert";
import Success from "../../Components/Success";

const Dashboard = () => {
  const { quizzes, setQuizzes } = useContext(QuizContext);

  //Loading State
  const [loading, setLoading] = useState(true);

  //Error State
  const [error, setError] = useState(null);

  //Success State
  const [success, setSuccess] = useState(null);

  // Grab all the quizzes on page load
  useEffect(() => {
    setTimeout(async () => {
      //grab all quizzes
      const data = await getQuizzes();
      //update quizzes state
      setQuizzes(data);
      //remove the loading
      setLoading(false);
    }, 500);
  }, []);


//Handle Delete posts
  const handleDelete = async (_id) => {
      try{
        const data = await deleteQuiz(_id);
        setSuccess(data.success);
      }
      catch(error){
        setError(error.message);
      }

      const newQuiz = quizzes.filter(quiz => quiz._id !== _id);
      setQuizzes(newQuiz);
  }

  return (
    <section className="card">
      <h1 className="title">Admin Dashboard</h1>

      {loading && (
        <p>
          <i className="fa-solid fa-spinner animate-spin text-3xl text-center block"></i>
        </p>
      )}

      {success && <Success msg={success} />}
      {error && <Alert msg={error} />}

      <div className="flex justify-evenly flex-wrap">
        {quizzes &&
          quizzes.map((quiz) => (
            <div key={quiz._id}>
              <Quiz quiz={quiz}>
                <Link
                  className="fa-solid fa-pen-to-square nav-link text-green-500 hover:bg-green-200"
                  title="Update"
                  to={`/update/${quiz._id}`}
                ></Link>
                <button
                  className="fa-solid fa-trash-can nav-link text-red-500 hover:bg-red-200"
                  title="Delete"
                  onClick={() => handleDelete(quiz._id)}
                ></button>
              </Quiz>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Dashboard;
