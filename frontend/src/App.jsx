import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import Dashboard from "./pages/users/Dashboard";
import Home from "./pages/quizzes/Home";
import Create from "./pages/quizzes/Create";
import ProtectedRoute from "./Components/ProtectedRoute";
import AuthRoute from "./Components/AuthRoute";
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import QuizTakingPage from "./pages/quizzes/QuizTakingPage";
import Update from "./pages/quizzes/Update";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<UnauthorizedAccess />} />

          {/* Protected Routes */}
          <Route element={<AuthRoute />}>
            <Route path="dashboard" element={<ProtectedRoute requiredRole="Admin" />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="create" element={<ProtectedRoute requiredRole="Admin" />}>
              <Route index element={<Create />} />
            </Route>
            <Route path="quiz/:id">
              <Route index element={<QuizTakingPage />} />
            </Route>
            <Route path="update/:id">
              <Route index element={<Update />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
