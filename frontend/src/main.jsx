import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./Assets/App.css";
import UserProvider from "./contexts/UserContext.jsx";
import QuizProvider from "./contexts/quizContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuizProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </QuizProvider>
  </React.StrictMode>
);
