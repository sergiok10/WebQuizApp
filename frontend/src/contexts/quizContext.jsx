import { createContext, useState } from 'react';

export const QuizContext = createContext();

const QuizProvider = ({ children }) => {
   const [ quizzes, setQuizzes ] = useState([]);

   return (
    <QuizContext.Provider value={{ quizzes, setQuizzes }}>
         {children}
    </QuizContext.Provider>
   )
};

export default QuizProvider;