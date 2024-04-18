import express from 'express'
import { commentLikeInfo, create, deleteComment, getPostComments } from '../controllers/comment.controller.js'
import {userTokenverification} from '../../utils/userVerification.js'

const commentRouter = express()

commentRouter.post('/create',userTokenverification,create)
commentRouter.get('/getPostComments/:postId',getPostComments)
commentRouter.put('/commentLikeInfo/:commentId',userTokenverification,commentLikeInfo)
commentRouter.delete('/deleteComment/:commentId',userTokenverification,deleteComment)

export default commentRouter