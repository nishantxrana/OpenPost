import express from 'express'
import {test} from '../controllers/user.controller.js';

const userRoutes = express.Router()

userRoutes.use('/test',test)

export default userRoutes;