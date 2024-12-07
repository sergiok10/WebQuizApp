import React from "react";

const Quiz = ({ quiz, onStartQuiz, highscore, children }) => {
  // Function to dynamically set badge color based on difficulty
  const getBadgeColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Hard":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // Function to dynamically set badge color based on category
  const getCategoryColor = (category) => {
    switch (category) {
      case "Science":
        return "bg-blue-500 text-white";
      case "Math":
        return "bg-purple-500 text-white";
      case "History":
        return "bg-orange-500 text-white";
      case "Technology":
        return "bg-teal-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="mb-6 max-w-xs mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-gray-800 dark:border-gray-700">
        {/* Quiz Image */}
        <a href="#">
          <img
            className="rounded-t-lg w-full h-48 object-cover"
            src={quiz.imageUrl}
            alt={quiz.quizName}
          />
        </a>

        {/* Quiz Content */}
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {quiz.quizName}
            </h5>
          </a>

          {/* Description */}
          <p className="mb-3 text-sm text-gray-700 dark:text-gray-400">
            {quiz.description}
          </p>

          {/* Difficulty and Category Badges */}
          <div className="mb-3 flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getBadgeColor(
                quiz.difficulty
              )} transition-all duration-300`}
            >
              {quiz.difficulty}
            </span>

            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(
                quiz.category
              )} transition-all duration-300`}
            >
              {quiz.category}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => onStartQuiz(quiz._id)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all"
            >
              Try Quiz!
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
            <div className="flex space-x-4">{children}</div>
          </div>
        </div>

        {/* Highscore */}
        <div className="mt-3 px-5 pb-5">
          {highscore !== null ? (
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Highscore: {highscore}
            </p>
          ) : (
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No highscore yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
