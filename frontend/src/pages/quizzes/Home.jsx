import { useEffect } from "react";
import { getQuizzes } from "../../controllers/quizzesController";
import { useContext } from "react";
import { QuizContext } from "../../contexts/quizContext";
import Quiz from "../../Components/Quiz";
import { useState } from "react";

const Home = () => {

    const { quizzes, setQuizzes } = useContext(QuizContext);

    //Loading State
    const [loading, setLoading] = useState(true);


  // Grab all the quizzes on page load
  useEffect(() => {
    setTimeout(async () => {
      //grab all quizzes
      const data = await getQuizzes();
      //update quizzes state
      setQuizzes(data);
      //remove the loading
      setLoading(false);
      console.log(data);
    }, 500);
  }, []);


  console.log(quizzes);

  return (
    <section className="card">
      <h1 className="title">Quizzes</h1>

      {loading && (
        <p><i className="fa-solid fa-spinner animate-spin text-3xl text-center block"></i></p>
      )}

      <div className="flex justify-evenly flex-wrap">
        { quizzes && quizzes.map(quiz => <div key={quiz._id}>
          <Quiz quiz={quiz} />
          
        </div>)}
      </div>
      
    </section>
  );
};

export default Home;
