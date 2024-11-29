export default function (err, req, res, next) {
  console.error(err);
  res.status(500).json({message: '무슨 에러일까요?'});
}