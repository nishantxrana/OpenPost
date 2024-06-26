import express from 'express'
import { createPost, deletepost, getposts, updatepost } from '../controllers/post.controller.js';
import { userTokenverification } from '../../utils/userVerification.js';

const postRoute = express.Router()

postRoute.post('/createPost',userTokenverification,createPost );
postRoute.get('/getposts',getposts);
postRoute.delete('/deletepost',userTokenverification,deletepost)
postRoute.put('/updatepost',userTokenverification,updatepost)

export default postRoute;