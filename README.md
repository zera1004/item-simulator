# ITEM SIMULATION

node.js의 express로 구현하는 간단한 아이템 시뮬레이션

<br>

<br>

## 개발기간

시작일: 2024/11/27

종류일: 2024/11/29

개발기간: 2일

<br>

<br>

## 사용 라이브러리

"@prisma/client": mysql 쿼리를 간편하게 작성하는 용도

"bcrypt": 서버에 저장하는 비밀번호를 해싱해서 안전하게 저장하는 용도

"cookie-parser": 클라이언트에게 받은 쿠키를 쉽게 받을 수 있는 용도

"express": nodejs에서 편하게 서버를 구축하는 프레임워크

"jsonwebtoken": JWT 생성과 검증을 위한 라이브러리

"prisma": cls에서 데이터베이스 업데이트 용도

"dotenv": 서버 주소와 포트 그리고 시크릿키 안전하게 깃에서 숨기고 개발환경에서 사용하기 위한 용도

"prettier": 일관적인 코드 작성을 위한 용도

"nodemon": 파일 저장시 자동으로 서버 재부팅

<br>

<br>

## 코드 구조

**/src**

app.js: 서버를 작동시키기 기능

<br>

**/router**

users.router.js: 회원가입과 로그인 페이지를 담당

- 회원가입: bcrypt를 사용해 패스워드를 해싱해 저장한다.

- 로그인: 일치여부를 미들웨어에서 확인하고 jwt를 생성한 후 헤더로 token을 전달한다.

<br>

items.router.js: 아이템 생성, 수정, 목록 조회, 상세조회를 맡는 페이지

<br>

characters.router.js: 캐릭터 생성, 본인 캐릭터 조회, 캐릭터 이름으로 조회, 캐릭터 선택, 캐릭터 삭제

<br>

**/middlewares**

user.middleware.js: users.router.js에서 사용하는 미들웨어

item.middleware.js: items.router.js에서 사용하는 미들웨어

error-handling.middleware.js: 에러처리를 했지만 알수없는 에러가 나왔을때를 대비해 app.js에서 사용

character.middleware.js: characters.router.js에서 사용하는 미들웨어

auth.middleware.js: 사용자 토큰에 uid값이 있는값인지, 변조되지 않았는지, 형식이 맞는지 확인하는 미들웨어, item과 character 라우터에서 사용함

<br>

**/untils/prisma**

index.js: 실행할때마다 새로운 인스턴스를 생성하지 않고 하나의 인스턴스를 사용하게 해줌

<br>

<br>

## 핵심기능

### 회원가입

HTTP 메서드: POST

주소: /api/sign-up

```json
{
  "uid": "test123",
  "name": "test",
  "pwd": "test123",
  "pwd2": "test123"
}
```

<br>

### 로그인

HTTP 메서드: POST

주소: /api/sign-in

```json
{
  "uid": "test123",
  "pwd": "test123"
}
```

<br>

### 캐릭터 생성

HTTP 메서드:POST

주소: /api/character/create

\*헤더의 Authorization에 로그인시 받은 토큰 필요

```json
{
  "characterName": "tes2t3"
}
```

<br>

### 내 캐릭터 조회

HTTP 메서드: GET

주소: /api/character/my

\*헤더의 Authorization에 로그인시 받은 토큰 필요

<br>

### 캐릭터 선택

HTTP 메서드: POST

주소: /api/character/choice

\*헤더의 Authorization에 로그인시 받은 토큰 필요

```json
{
  "characterName": "tes2t3"
}
```

캐릭터 선택시 uid와 characterName을 담은 새로운 토큰 전달하지만, 도전기능 구현을 안해서 필요x

<br>

### 캐릭터 이름으로 조회

HTTP 메서드: GET

주소: /api/character/lookup/:characterName

\*헤더의 Authorization에 로그인시 받은 토큰 필요

<br>

### 캐릭터 삭제

HTTP 메서드: DELETE

주소: /api/character/delete

\*헤더의 Authorization에 로그인시 받은 토큰 필요

```json
{
  "characterName": "tes2t3"
}
```

<br>

### 아이템 생성

HTTP 메서드: POST

주소: /api/item/create

\*헤더의 Authorization에 로그인시 받은 토큰 필요, 토큰의 uid가 'admin0'이어야함(회원가입시 uid가 admin0 이어야함)

```json
{
  "itemName": "adminchestArmor225333",
  "itemType": "chestArmor",
  "itemAbility": 50,
  "itemPrice": 100
}
```

itemType에는 weapon,helmet,chestArmor,legArmor중 하나여야만 작동

<br>

### 아이템 수정

HTTP 메서드: PUT

주소: /api/item/modify

\*헤더의 Authorization에 로그인시 받은 토큰 필요, 토큰의 uid가 'admin0'이어야함(회원가입시 uid가 admin0 이어야함)

```json
{
  "itemName": "adminchestArmor2533",
  "itemAbility": 1110
}
```

<br>

### 아이템 목록 조회

HTTP 메서드: GET

주소: /api/item/all

\*헤더의 Authorization에 로그인시 받은 토큰 필요

<br>

### 아이템 상세 조회

HTTP 메서드: GET

주소: /api/item/info/:itemName

\*헤더의 Authorization에 로그인시 받은 토큰 필요

<br>

<br>

## 질문과 답변

### **암호화 방식**

- 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?

해시는 단방향 암호화에 해당합니다.

- 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?

비밀번호 저장 데이터베이스가 털렸을때 해커가 원래값을 복원을 할 수 없고 때려맞추기 밖에 없어서 비교적 안전해집니다.

<br>

### **인증 방식**

- JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?

해커가 접근해서 안될 곳에 접근할 수 있습니다.(개인정보 등등)

- 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?

엑세스 토큰 시간을 짧게하고 리프레시토큰 사용하기, 초기 엑세스 토큰 부여시 유저 ip, 기기정보 등을 기록해 대조하기

<br>

### **인증과 인가**

- 인증과 인가가 무엇인지 각각 설명해 주세요.

인증은 사용자 정보를 확인하는 과정, 인가는 권한 부여하는 과정

- 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?

보안이 필요한가 필요하지 않고 보여줘도 되는가의 차이

- 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?

아이템 생성과 수정은 누구나 함부로 수정해서 안되는 중요한 기능이기 때문입니다.

<br>

### **Http Status Code**

- 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.

200: 요청이 성공적으로 처리되었음(클라이언트가 요청해서 성공적으로 처리했을때)

201: POST 요청일때 새로운 데이터 생성이 성공적으로 처리되었음(클라이언트가 캐릭생성이나, 아이템 생성,수정 등을 요청 후 성공했을때)

400: 클라이언트가 잘못 요청해서 오류 발생시(클라이언트가 입력을 제대로 하지않아 실패했을때)

500: 예상치 못한 오류 발생시(나도 모르는 오류 발생시)

<br>

### **게임 경제**

- 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다.

  - 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요?

  보안?

  - 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?

  게임머니 관련된걸 별도로 관리?

- 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?

클라이언트 측에서 아이템 가격을 시가보다 낮거나 무료로 얻을 수 있습니다.