import {errorDisplay} from './error.js';
import jwt from 'jsonwebtoken';

export const userTokenverification =  (req, res, next) => {
    
    const token =  req.cookies.login_token;

    if(!token) {
        return next(errorDisplay(200, 'Invalid login token'));
    }
    
    jwt.verify(token, process.env.Token_key, (err, decoded) => {
        if(err) {
            return next(errorDisplay(200, 'Invalid login token'));
        }
        req.user = decoded;
        next();
    });
    
}