import express from 'express'
import {deleteUser, test, updateInfo} from '../controllers/user.controller.js';
import { userTokenverification } from '../../utils/userVerification.js';

const userRoutes = express.Router()

userRoutes.use('/test',test);
userRoutes.put('/update/:userId',userTokenverification,updateInfo);
userRoutes.delete('/delete/:userId',userTokenverification,deleteUser);

export default userRoutes;