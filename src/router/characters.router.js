import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import authMiddleWare from '../middlewares/auth.middleware.js';
import { checkCreateCharacter } from '../middlewares/character.middleware.js';
import { checkChoiceCharacter } from '../middlewares/character.middleware.js';
import { checkLookupCharacter } from '../middlewares/character.middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 캐릭터 생성
router.post(
  '/create',
  authMiddleWare,
  checkCreateCharacter,
  async (req, res, next) => {
    try {
      const { characterName } = req.body;
      const { userId } = req.user;

      const character = await prisma.characters.create({
        data: {
          userId: +userId,
          characterName,
          money: 10000,
          attackAbility: 100,
          defenseAbility: 10,
          healthAbility: 1000,
        },
      });
      return res.status(201).json({
        message: '캐릭터가 생성되었습니다.',
        createdCharacter: character,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 본인 캐릭터 조회
router.get('/my', authMiddleWare, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const allCharacter = await prisma.characters.findMany({
      where: { userId: +userId },
      select: {
        characterName: true,
        money: true,
        attackAbility: true,
        defenseAbility: true,
        healthAbility: true,
      },
    });
    return res.status(200).json({ myCharacters: allCharacter });
  } catch (err) {
    next(err);
  }
});

// 캐릭터 이름으로 조회
router.get(
  '/lookup/:characterName',
  authMiddleWare,
  checkLookupCharacter,
  async (req, res, next) => {
    try {
      const { characterName } = req.params;
      const lookupCharacter = await prisma.characters.findFirst({
        where: { characterName },
        select: {
          characterName: true,
          attackAbility: true,
          defenseAbility: true,
          healthAbility: true,
        },
      });
      return res.status(200).json({ character: lookupCharacter });
    } catch (err) {
      next(err);
    }
  }
);

// 캐릭터 선택, 새로운 토큰 부여
router.post(
  '/choice',
  authMiddleWare,
  checkChoiceCharacter,
  async (req, res, next) => {
    try {
      const { uid } = req.user;
      const { characterName } = req.body;
      const token = jwt.sign({ uid, characterName }, process.env.JWT_KEY);
      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json({ message: '캐릭터를 선택하였습니다.' });
    } catch (err) {
      next(err);
    }
  }
);

// 캐릭터 삭제
router.delete(
  '/delete',
  authMiddleWare,
  checkChoiceCharacter,
  async (req, res, next) => {
    try {
      const { characterName } = req.body;
      const deleteCharacter = await prisma.characters.delete({
        where: { characterName },
      });
      return res.status(201).json({ message: '해당 캐릭터를 삭제하였습니다.' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
