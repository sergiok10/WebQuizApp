import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', QuizSchema);

export default Quiz;