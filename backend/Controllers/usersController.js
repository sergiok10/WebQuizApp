import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config.js';
import jwt from 'jsonwebtoken';

/***************************************** Creating JWT Token *****************************************/
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });
}

/*****************************************Register User *****************************************/
const registerUser = async (req, res) => {
    //Grab Data from the Request Body
    const {email, password} = req.body;

    //Check the fields are not empty
    if(!email || !password ){
        return res.status(400).json({ msg: 'All fields are required' });
    }

    //Check if user email already exists
    const exist = await User.findOne({ email });
    if(exist){
        return res.status(400).json({ error: 'Email is already taken' });
    }

    //Hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        //Register the User
        const user = await User.create({email, password: hashedPassword, role: "User"});
        //Create a JWT Token
        const token = createToken(user._id);
        //Send the Token in the Response
        res.status(200).json({ email, token }); 
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}


/*****************************************Login User *****************************************/
const loginUser = async (req, res) => {
    //Grab Data from the Request Body
    const {email, password} = req.body;

    //Check the fields are not empty
    if(!email || !password){
        return res.status(400).json({ msg: 'All fields are required' });
    }

    //Check if user email already exists
    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({ error: 'Incorrect email or password' });
    }

    //Check if the password is correct
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).json({ error: 'Incorrect email or password' });
    }

    try{
        //Create a JWT Token
        const token = createToken(user._id);

        res.status(200).json({ email, token, role: user.role }); 
    }
    catch(error){
        console.log(err);
        res.status(500).json({ error: error.message });
    }
}

/***************************************** Update Highscore *****************************************/
const updateHighscore = async (req, res) => {
    const { quizId, score } = req.body;
    const userId = req.user._id; // Assuming the JWT token has been verified and the user is available in `req.user`

    if (!quizId || score === undefined) {
        return res.status(400).json({ msg: 'Quiz ID and score are required' });
    }

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user has a highscore for the given quiz
        const existingHighscore = user.highscores.find(highscore => highscore.quizId.toString() === quizId);

        if (existingHighscore) {
            console.log(existingHighscore.score);
            console.log(score);
            // If the user already has a highscore for this quiz, update it if the new score is higher
            if (score > existingHighscore.score) {
                existingHighscore.score = score;
                await user.save();
                return res.status(200).json({ msg: 'Highscore updated successfully!' });
            } else {
                return res.status(200).json({ msg: 'Score is not higher than the existing highscore' });
            }
        } else {
            // If the user doesn't have a highscore for this quiz, add a new highscore
            user.highscores.push({ quizId, score });
            await user.save();
            return res.status(200).json({ msg: 'Highscore added successfully!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};


export {registerUser, loginUser, updateHighscore};