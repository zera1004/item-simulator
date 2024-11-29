import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import { checkSignUp } from '../middlewares/user.middleware.js';
import { checkSignIn } from '../middlewares/user.middleware.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 회원가입
router.post('/sign-up', checkSignUp, async (req, res, next) => {
  try {
    const { name, uid, pwd } = req.body;
    const hashedpwd = await bcrypt.hash(pwd, Number(process.env.BCRYPT_NUM));
    const user = await prisma.users.create({
      data: {
        userName: name,
        uid,
        pwd: hashedpwd,
      },
    });
    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 로그인
router.post('/sign-in', checkSignIn, async (req, res, next) => {
  try {
    const { uid } = req.body;
    const token = jwt.sign({ uid }, process.env.JWT_KEY);
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({ message: '로그인에 성공하였습니다.' });
  } catch (err) {
    next(err);
  }
});

export default router;
