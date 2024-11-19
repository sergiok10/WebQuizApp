import express from 'express';
import { registerUser, loginUser, updateHighscore } from '../Controllers/usersController.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();

//Register a new User Route
router.post('/', registerUser);

//login a User Route
router.post('/login', loginUser);

router.post('/update-highscore', auth, updateHighscore);

export {router as userRoutes}; 