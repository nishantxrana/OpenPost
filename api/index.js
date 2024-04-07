import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import auth from './routes/auth.route.js';
// import { env } from 'process'; // can use this to env.mongoKey

dotenv.config()

mongoose.connect(process.env.mongoKey).then(()=>{
    console.log("mongodb successfully connected");
}).catch(err => {
    console.log(err.message);
});

let port = 3000;
const app = express()
app.use(express.json());


app.use('/api/user',userRoutes)
app.use('/api/auth',auth)

app.listen(port,()=>{
    console.log(`listening on ${port}`);
})
app.use((err,req,res,next)=>{
    const message = err.message || 'internal error';
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});