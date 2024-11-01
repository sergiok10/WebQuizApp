import express from 'express';
import { userRoutes } from './routes/userRoutes.js';
import { leaseApplicationRoutes } from './routes/leaseApplicationRoutes.js';
import { questionRoutes } from './routes/questionRoutes.js';
import { quizRoutes } from './routes/quizRoutes.js';
import mongoose from 'mongoose';

const app = express(); 




app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/applications', leaseApplicationRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz', quizRoutes);

mongoose.connect('mongodb+srv://sergiok:Leoleague123!@cluster0.4mdxf.mongodb.net', { dbName: 'demo_db' }).then(() => {
    console.log('Connected to MongoDB');
    app.listen(4000, () => {
        console.log('listening on port 4000');
    });
}).catch(err => {
    console.log(err);
});

