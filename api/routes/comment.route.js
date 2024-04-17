import express from 'express'
import { create, getPostComments } from '../controllers/comment.controller.js'
import {userTokenverification} from '../../utils/userVerification.js'

const commentRouter = express()

commentRouter.post('/create',userTokenverification,create)
commentRouter.get('/getPostComments/:postId',getPostComments)

export default commentRouter