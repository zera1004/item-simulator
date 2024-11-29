import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleWare from '../middlewares/auth.middleware.js';
import { checkCreate } from '../middlewares/item.middleware.js';
import { checkModify } from '../middlewares/item.middleware.js';
import { checkInfo } from '../middlewares/item.middleware.js';

const router = express.Router();

// 아이템 생성(id가 admin0일때만 가능)
router.post('/create', authMiddleWare, checkCreate, async (req, res, next) => {
  try {
    const { itemName, itemType, itemAbility, itemPrice } = req.body;
    const createItem = await prisma.items.create({
      data: { itemName, itemType, itemAbility, itemPrice },
    });
    return res
      .status(201)
      .json({ message: '아이템이 생성되었습니다.', item: createItem });
  } catch (err) {
    next(err);
  }
});

// 아이템 수정(id가 admin0일때만 가능)
router.put('/modify', authMiddleWare, checkModify, async (req, res, next) => {
  try {
    const { itemName, itemAbility } = req.body;

    const modifyItem = await prisma.items.update({
      where: { itemName },
      data: { itemAbility },
    });
    return res.status(201).json({
      message: '아이템 정보가 수정되었습니다.',
      modifiedItem: modifyItem,
    });
  } catch (err) {
    next(err);
  }
});

// 아이템 목록 조회
router.get('/all', authMiddleWare, async (req, res, next) => {
  try {
    const allItems = await prisma.items.findMany({
      select: {
        itemId: true,
        itemName: true,
        itemPrice: true,
      },
    });
    return res.status(200).json(allItems);
  } catch (err) {
    next(err);
  }
});

// 아이템 상세 조회
router.get(
  '/info/:itemName',
  authMiddleWare,
  checkInfo,
  async (req, res, next) => {
    try {
      const { itemName } = req.params;
      const info = await prisma.items.findFirst({
        where: { itemName },
        select: {
          itemId: true,
          itemName: true,
          itemType: true,
          itemAbility: true,
          itemPrice: true,
        },
      });
      return res.status(200).json(info);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
