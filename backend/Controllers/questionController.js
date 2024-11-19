import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import Question from '../models/QuestionModel.js';
import Quiz from '../models/QuizModel.js';

/**********************************************Get All Applications of a specific user  *********************************************/
    // Fetch all questions of a specific quiz
    const getAllQuestionsOfQuiz = async (req, res) => {
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
        }

        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        const questions = {};

        //make a loop over all the questions of the quiz
        for (const question of quiz.questions) {
            const question_ = await Question.findById(question);
            if (!question_) {
                return res.status(404).json({ error: "Question not found" });
            }
            questions[question] = question_;
        }
        
    
        try {
        res.status(200).json({quiz: quiz, questions: questions});
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        }
    };

/**********************************************Create New Application *******************************************/
const addQuestionToQuiz = async (req, res) => {

    //Grab Data from the Request Body
    const {question, options, answer, quizId} = req.body;
    
    //Check the fields are not empty
    if(!question || !options || !answer || !quizId){
        return res.status(400).json({ msg: 'All fields are required' });
    }

    //Grab the authenticated user from the request body
    const user  = await User.findById(req.user._id);

    //check if the user is an admin
    if(user.role !== 'Admin'){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    //check if the quiz exists
    const quiz = await Quiz.findById(quizId);
    if(!quiz){
        return res.status(404).json({ error: 'Quiz Not Found' });
    }

    try{
        const question = await Question.create({quiz: quiz, question, options, answer}); 
        res.status(200).json({ success: 'Question Created.', question });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
    
}

/**********************************************Delete Application *******************************************/
const deleteQuestion = async (req, res) => {

    //Check if the ID is Valid
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({ error: 'Invalid ID' });
    }

    //check if the question exists
    const question = await Question.findById(req.params.id);
    if(!question){
        return res.status(404).json({ error: 'Question Not Found' });
    }

    //check if the user is an admin
    const user = await User.findById(req.user._id);
    if(user.role !== 'Admin'){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try{
        await question.deleteOne();
        res.status(200).json({ success: 'Question Deleted' });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/**********************************************Update Question *******************************************/
const updateQuestion = async (req, res) => {

    //Check if the ID is Valid
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    //Grab Data from the Request Body
    const {question, options, answer} = req.body;

    //check all fields are not empty
    if(!question || !options || !answer){
        return res.status(400).json({ msg: 'All fields are required' });
    }

    //Check if the Question Exists
    const question_  = await Question.findById(req.params.id);
    if(!question_){
        return res.status(404).json({ error: 'Question Not Found' });
    }

    //Check if the User is an Admin
    const user = await User.findById(req.user._id);
    if(user.role !== 'Admin'){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try{
        await Question.updateOne({question, options, answer});
        res.status(200).json({ success: 'Question Updated' });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

export { getAllQuestionsOfQuiz, addQuestionToQuiz, deleteQuestion, updateQuestion };