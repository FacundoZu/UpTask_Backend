import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

type UserPayload = {
    id: Types.ObjectId;
};

export const generateJWT = (payload: UserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    
    return token;
};