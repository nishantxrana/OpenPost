import express from 'express';
import { signup } from '../controllers/auth.controller.js';

const auth = express.Router();

auth.post('/signup',signup)

export default auth