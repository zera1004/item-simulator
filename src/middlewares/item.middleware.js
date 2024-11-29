import { prisma } from '../utils/prisma/index.js';

// 아이템 생성 검증 미들웨어
export async function checkCreate(req, res, next) {
  try {
    const { itemName, itemType, itemAbility, itemPrice } = req.body;
    const { uid } = req.user;
    if (uid != 'admin0') throw new Error('당신은 관리자가 아닙니다.');
    if (!itemName || !itemType || !itemAbility || !itemPrice)
      throw new Error('아이템 생성에 필요한 모든 정보를 입력해주세요');
    const checkName = await prisma.items.findFirst({
      where: { itemName },
    });
    if (checkName) throw new Error('이미 존재하는 이름의 아이템입니다.');
    if (
      itemType != 'weapon' &&
      itemType != 'helmet' &&
      itemType != 'chestArmor' &&
      itemType != 'legArmor'
    )
      throw new Error('아이템 타입을 맞게 적어주세요');

    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}

// 아이템 수정 검증 미들웨어
export async function checkModify(req, res, next) {
  try {
    const { itemName, itemAbility } = req.body;
    const { uid } = req.user;
    if (uid != 'admin0') throw new Error('당신은 관리자가 아닙니다.');
    if (!itemName || !itemAbility)
      throw new Error('아이템 생성에 필요한 모든 정보를 입력해주세요');
    const checkName = await prisma.items.findFirst({
      where: { itemName },
    });
    if (!checkName) throw new Error('존재하지 않는 아이템입니다.');

    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}

// 아이템 목록 상세 조회 미들웨어
export async function checkInfo(req, res, next) {
  try {
    const { itemName } = req.params;
    const checkName = await prisma.items.findFirst({
      where: { itemName },
    });
    if (!checkName) throw new Error('존재하지 않는 아이템입니다.');
    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}
