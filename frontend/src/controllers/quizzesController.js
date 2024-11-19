  /********************************************** Get all quizzes ***************************************************/
  const getQuizzes = async () => {

    const res = await fetch("/api/quiz", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      }
    });

      const data = await res.json();

      if (!res.ok) {
          throw Error(data.error);
      }

      return data;
  };
  

  /***********************************************Get Applications By Category and Difficulty ***************************/
  const getQuizzesByCategoryAndDifficulty = async (category, difficulty) => {
    // If no category or difficulty is provided, don't apply the filter for that field
    const queryCategory = category ? category : 'ALL'; // Empty string means no category filter
    const queryDifficulty = difficulty ? difficulty : 'ALL'; // Empty string means no difficulty filter
  
    const res = await fetch(`/api/quiz/${queryCategory}/${queryDifficulty}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      }
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      console.error('Error fetching quizzes:', data.error);
      throw new Error(data.error);
    }
  
    return data;
  };
  




  /********************************************** Create Quiz  ******************************************************/
  const createQuiz = async (quizName, questions, description, duration, category, difficulty, user) => {
    if (!quizName || !questions || !description || !duration || !category || !difficulty) {
      throw Error("Please fill in all fields");
    }

    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
      body: JSON.stringify({ quizName, questions, description, duration, category, difficulty }),
    });

      const data = await res.json();

      if (!res.ok) {
          throw Error(data.error);
      }

      return data;
  };

  /********************************************** Delete Quiz ******************************************************/
  const deleteQuiz = async (_id) => {
    const res = await fetch(`/api/quiz/${_id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user.token}`,
      },
      });

      const data = await res.json();

      if (!res.ok) {
          throw Error(data.error);
      }

      return data;
  }

  const getAllQuestionsOfQuiz = async (quizId) => {
    const res = await fetch(`/api/questions/${quizId}`);
    const data = await res.json();

    if (!res.ok) {
      throw Error(data.error);
    }

    return data;
  }

  export { getQuizzes, createQuiz, deleteQuiz, getAllQuestionsOfQuiz, getQuizzesByCategoryAndDifficulty };
