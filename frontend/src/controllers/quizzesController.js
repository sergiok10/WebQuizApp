/********************************************** Get all quizzes ***************************************************/
const getQuizzes = async () => {
  const res = await fetch("/api/quiz");
  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }

  return data;
};

/********************************************** Create Quiz  ******************************************************/
const createQuiz = async (quizName, questions, description) => {
  if (!quizName || !questions || !description) {
    throw Error("Please fill in all fields");
  }

  const res = await fetch("/api/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ quizName, questions, description }),
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
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    });

    const data = await res.json();

    if (!res.ok) {
        throw Error(data.error);
    }

    return data;
}

export { getQuizzes, createQuiz, deleteQuiz };
