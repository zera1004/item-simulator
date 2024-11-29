import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import dotenv from 'dotenv';

dotenv.config();

// 토근 검증 미들웨어
export default async function (req, res, next) {
  try {
    const authorization = req.headers['authorization'];
    if (!authorization)
      throw new Error('요청한 사용자의 토큰이 존재하지 않습니다.');
    const [tokenType, token] = authorization.split(' ');
    if (tokenType != 'Bearer') throw new Error('토큰 형식이 잘못되었습니다.');
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const uid = decodedToken.uid;

    const user = await prisma.users.findFirst({
      where: { uid },
    });
    if (!user) throw new Error('토큰과 일치하는 사용자가 존재하지 않습니다.');


    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}
