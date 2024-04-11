import express from 'express'
import {test, updateInfo} from '../controllers/user.controller.js';
import { userTokenverification } from '../../utils/userVerification.js';

const userRoutes = express.Router()

userRoutes.use('/test',test)
userRoutes.put('/update/:userId',userTokenverification,updateInfo)

export default userRoutes;