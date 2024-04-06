import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
// import { env } from 'process'; // can use this to env.mongoKey

dotenv.config()

mongoose.connect(process.env.mongoKey).then(()=>{
    console.log("mongodb successfully connected");
}).catch(err => {
    console.log(err.message);
});

let port = 3000;
const app = express()
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port,()=>{
    console.log(`listening on ${port}`);
})