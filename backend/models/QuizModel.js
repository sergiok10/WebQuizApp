import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Math', 'Science', 'History', 'Geography', 'Tech', 'Games'],
    },
    difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', QuizSchema);

export default Quiz;