import { prisma } from '../utils/prisma/index.js';

// 캐릭터 생성 검증 미들웨어
export async function checkCreateCharacter(req, res, next) {
  try {
    const { characterName } = req.body;
    const checkCharacter = await prisma.characters.findFirst({
      where: { characterName },
    });
    if (checkCharacter) throw new Error('이미 존재하는 닉네임입니다.');

    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}

// 캐릭터 선택, 삭제 검증 미들웨어
export async function checkChoiceCharacter(req, res, next) {
  try {
    const { userId } = req.user;
    const { characterName } = req.body;

    const checkCharacter = await prisma.characters.findFirst({
      where: { characterName },
    });
    if (!checkCharacter) throw new Error('존재하지 않는 캐릭터입니다.');
    if (checkCharacter.userId !== userId)
      throw new Error('당신의 캐릭터가 아닙니다.');

    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}

// 캐릭터 이름 검색 검증 미들웨어
export async function checkLookupCharacter(req, res, next) {
  try {
    const { characterName } = req.params;
    const checkCharacter = await prisma.characters.findFirst({
      where: { characterName },
    });
    if (!checkCharacter) throw new Error('존재하지 않는 캐릭터입니다.');

    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}
