import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import Quiz from '../models/QuizModel.js';
import Question from '../models/QuestionModel.js';

/********************************************** Get All Quizzes with User's Highscore *********************************************/
const getQuizzes = async (req, res) => {
    const userId = req.user._id; // Assuming the JWT token has been verified and user is available in `req.user`

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get all quizzes
        const quizzes = await Quiz.find();

        // Attach the user's highscore for each quiz
        const quizzesWithHighscores = quizzes.map(quiz => {
            // Find the user's highscore for the current quiz
            const highscore = user.highscores.find(score => score.quizId.toString() === quiz._id.toString());
            return {
                ...quiz.toObject(), // Spread the quiz data
                highscore: highscore ? highscore.score : null // Add the highscore if available
            };
        });

        // Return the quizzes with the user's highscore
        res.status(200).json(quizzesWithHighscores);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


const getQuizzesByCategoryAndDifficulty = async (req, res) => {
    console.log("test")
    const userId = req.user._id; // Assuming the JWT token has been verified and user is available in `req.user`
    const { category, difficulty } = req.params;

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Build the query based on available filters
        const query = {};

        // Only add category filter if it's provided
        if (category && category !== "ALL") {
            query.category = category;
        }

        // Only add difficulty filter if it's provided
        if (difficulty && difficulty !== "ALL") {
            query.difficulty = difficulty;
        }

        // Get all quizzes that match the filters
        const quizzes = await Quiz.find(query);

        // Attach the user's highscore for each quiz
        const quizzesWithHighscores = quizzes.map(quiz => {
            const highscore = user.highscores.find(score => score.quizId.toString() === quiz._id.toString());
            return {
                ...quiz.toObject(), // Spread the quiz data
                highscore: highscore ? highscore.score : null // Add the highscore if available
            };
        });

        // Return the quizzes with the user's highscore
        res.status(200).json(quizzesWithHighscores);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};




/**********************************************Create New Application *******************************************/
const addNewQuiz = async (req, res) => {
    // Grab Data from the Request Body
    const { quizName, questions, description, imageUrl, duration, category, difficulty } = req.body;

    console.log(req.body);
    
    // Check the fields are not empty
    if (!quizName || !questions || !description || !imageUrl || !duration || !category || !difficulty) {
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
        const quiz = await Quiz.create({ quizName, questions: [], description, imageUrl, duration, category, difficulty });

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
    const { quizName, questions, description, imageUrl, duration, category, difficulty } = req.body;
    
    console.log(req.body);
    // Check the fields are not empty
    if (!quizName || !questions || !description || !imageUrl || !duration || !category || !difficulty) {
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
        quiz.imageUrl = imageUrl;
        quiz.questions = updatedQuestionsArray.map(q => q._id);
        quiz.duration = duration;
        quiz.category = category;
        quiz.difficulty = difficulty;
        await quiz.save();

        res.status(200).json({ success: 'Quiz Updated', quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getQuizById = async (req, res) => {

    try{
        const quiz = await Quiz.findById(req.params.id).populate('questions');
        if(!quiz){
            return res.status(404).json({ error: 'Quiz Not Found' });
        }
        res.status(200).json(quiz);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export { getQuizzes, getQuizzesByCategoryAndDifficulty, addNewQuiz, deleteQuiz, updateQuiz, getQuizById };