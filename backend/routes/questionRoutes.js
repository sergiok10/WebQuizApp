import express from 'express';
import {getAllQuestionsOfQuiz, addQuestionToQuiz, deleteQuestion, updateQuestion } from '../Controllers/questionController.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();


//Get All Applications for specific user Route
router.get('/:id', getAllQuestionsOfQuiz);

//Add a new Application Route
router.post('/', auth, addQuestionToQuiz);

//Delete an Application Route
router.delete('/:id', auth, deleteQuestion);

//Update an Application Route
router.put('/:id', auth, updateQuestion);

export {router as questionRoutes};