import express from 'express';
import { getQuizzes, getQuizzesByCategoryAndDifficulty, addNewQuiz, deleteQuiz, updateQuiz } from '../Controllers/quizController.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();


//Get All Applications for specific user Route
router.get('/', auth, getQuizzes);

//Get Applications based on the Category and Difficulty
router.get('/:category/:difficulty', auth, getQuizzesByCategoryAndDifficulty);

//Add a new Application Route
router.post('/', auth, addNewQuiz);

//Delete an Application Route
router.delete('/:id', auth, deleteQuiz);

//Update an Application Route
router.put('/:id', auth, updateQuiz);

export {router as quizRoutes};