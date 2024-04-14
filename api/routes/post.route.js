import express from 'express'
import { createPost } from '../controllers/post.controller.js';
import { userTokenverification } from '../../utils/userVerification.js';

const postRoute = express.Router()

postRoute.use('/createPost',userTokenverification,createPost );

export default postRoute;