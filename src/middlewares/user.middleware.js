import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';

// 회원가입 검증 미들웨어
export async function checkSignUp(req, res, next) {
  try {
    const { name, uid, pwd, pwd2 } = req.body;
    if (!name || !uid || !pwd || !pwd2)
      throw new Error('가입에 필요한 모든 정보를 작성해 주세요.');
    if (!haveLetterNum(uid))
      throw new Error('아이디를 영어소문자와 숫자조합으로 작성해 주세요.');
    const isExistUser = await prisma.users.findFirst({
      where: { uid },
    });
    if (isExistUser) throw new Error('이미 존재하는 아이디입니다.');
    if (pwd.length < 6)
      throw new Error('비밀번호를 6자 이상으로 작성해 주세요.');
    if (pwd != pwd2)
      throw new Error('비밀번호와 비밀번호2가 일치하지 않습니다.');
    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}

// 회원가입 아이디가 문자와 숫자 가지고 있는지 확인하는 함수
function haveLetterNum(id) {
  let haveLetter = false;
  let haveNum = false;

  id = id.split('');

  for (let i = 0; i < id.length; i++) {
    if (id[i] >= 'a' && id[i] <= 'z') haveLetter = true; // 문자 들어있으면 haveLetter true로 변경
    if (id[i] >= '0' && id[i] <= '9') haveNum = true; // 숫자 들어있으면 haveNum true로 변경
    if (haveLetter && haveNum) break; // 둘 다 true가 되면 true 반환
  }
  return haveLetter && haveNum; // 반복문을 빠져나오게 되면 false 반환
}

// 아이디 비밀번호 검증 미들웨어
export async function checkSignIn(req, res, next) {
  try {
    const { uid, pwd } = req.body;
    const isExistUser = await prisma.users.findFirst({
      where: { uid },
    });
    if (!isExistUser) throw new Error('없는 아이디입니다.');
    const user = await prisma.users.findFirst({
      where: { uid },
    });
    if (!(await bcrypt.compare(pwd, user.pwd)))
      throw new Error('비밀번호가 일치하지 않습니다.');
    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}
