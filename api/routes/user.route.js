import express from 'express'
import {deleteUser, getUserDetails, getUsers, logOut, test, updateInfo} from '../controllers/user.controller.js';
import { userTokenverification } from '../../utils/userVerification.js';

const userRoutes = express.Router()

userRoutes.use('/test',test);
userRoutes.put('/update/:userId',userTokenverification,updateInfo);
userRoutes.delete('/delete/:userId',userTokenverification,deleteUser);
userRoutes.post('/logout',logOut);
userRoutes.get('/getusers',userTokenverification,getUsers)
userRoutes.get('/getuserDetails/:userId',getUserDetails)

export default userRoutes;