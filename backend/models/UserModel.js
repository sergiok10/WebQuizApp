import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    highscores: [{
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        score: { type: Number }
    }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;