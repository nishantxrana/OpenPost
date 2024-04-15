import express from 'express'
import { createPost, getPosts } from '../controllers/post.controller.js';
import { userTokenverification } from '../../utils/userVerification.js';

const postRoute = express.Router()

postRoute.post('/createPost',userTokenverification,createPost );
postRoute.get('/getPosts',getPosts);

export default postRoute;