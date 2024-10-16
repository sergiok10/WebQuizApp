import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import Quiz from '../models/QuizModel.js';
import Question from '../models/QuestionModel.js';

/**********************************************Get All Applications of a specific user  *********************************************/
const getQuizzes = async (req, res) => {
    //get all quizzes
    try{
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/**********************************************Create New Application *******************************************/
const addNewQuiz = async (req, res) => {
    // Grab Data from the Request Body
    const { quizName, questions, description } = req.body;

    console.log(req.body);
    
    // Check the fields are not empty
    if (!quizName || !questions || !description) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    // Grab the authenticated user from the request body
    const user = await User.findById(req.user._id);

    // Check if the user is an admin
    if (user.role !== 'Admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if all questions have the required fields
    for (const question of questions) {
        if (!question.question || !question.options || !question.answer) {
            return res.status(400).json({ msg: 'All fields are required for each question' });
        }
    }

    try {
        // Create the quiz first
        const quiz = await Quiz.create({ quizName, questions: [], description });

        // Create questions and add the quiz ID to each question
        const questionsArray = [];
        for (const question of questions) {
            const newQuestion = await Question.create({
                question: question.question,
                options: question.options,
                answer: question.answer,
                quiz: quiz._id
            });
            questionsArray.push(newQuestion._id);
        }

        // Update the quiz with the question IDs
        quiz.questions = questionsArray;
        await quiz.save();

        res.status(201).json({ success: 'Quiz Created.', quiz });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: error.message });
    }
};

/**********************************************Delete Application *******************************************/
const deleteQuiz = async (req, res) => {

    //Check if the ID is Valid
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({ error: 'Invalid ID' });
    }

    console.log(req.params.id);

    //Check if the Quiz Exists
    const quiz = await Quiz.findById(req.params.id);
    if(!quiz){
        return res.status(404).json({ error: 'Quiz Not Found' });
    }

    //Check if the User is an Admin
    const user = await User.findById(req.user._id);
    if(user.role !== 'Admin'){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try{
        //delete the quiz and questions
        await quiz.deleteOne();
        for(const question of quiz.questions){
            const questionToBeDeleted = Question.findById(question._id);
            await questionToBeDeleted.deleteOne();
        }
        res.status(200).json({ success: 'Quiz Deleted' });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/**********************************************Update Application *******************************************/
const updateQuiz = async (req, res) => {
    // Check if the ID is Valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    // Grab Data from the Request Body
    const { quizName, questions, description } = req.body;
    
    // Check the fields are not empty
    if (!quizName || !questions || !description) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if the Quiz Exists
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        return res.status(404).json({ error: 'Quiz Not Found' });
    }

    // Check if the User is an Admin
    const user = await User.findById(req.user._id);
    if (user.role !== 'Admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if all questions have the required fields
    for (const question of questions) {
        if (!question.question || !question.options || !question.answer) {
            return res.status(400).json({ msg: 'All question fields are required' });
        }
    }

    try {
        // Update existing questions or create new ones
        const updatedQuestionsArray = [];
        for (const question of questions) {
            if (question._id) {
                // Update existing question
                const existingQuestion = await Question.findById(question._id);
                if (existingQuestion) {
                    existingQuestion.question = question.question;
                    existingQuestion.options = question.options;
                    existingQuestion.answer = question.answer;
                    await existingQuestion.save();
                    updatedQuestionsArray.push(existingQuestion);
                }
            } else {
                // Create new question
                const newQuestion = await Question.create({
                    question: question.question,
                    options: question.options,
                    answer: question.answer
                });
                updatedQuestionsArray.push(newQuestion);
            }
        }

        // Remove questions that are no longer in the updated quiz
        for (const oldQuestionId of quiz.questions) {
            if (!updatedQuestionsArray.some(q => q._id.toString() === oldQuestionId.toString())) {
                await Question.findByIdAndDelete(oldQuestionId);
            }
        }

        // Update the quiz
        quiz.quizName = quizName;
        quiz.description = description;
        quiz.questions = updatedQuestionsArray.map(q => q._id);
        await quiz.save();

        res.status(200).json({ success: 'Quiz Updated', quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export { getQuizzes, addNewQuiz, deleteQuiz, updateQuiz };