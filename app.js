const express = require('express')
const app = express()
const port = 3000
const ejs = require('ejs')
var bodyParser = require('body-parser')  // body 미들웨어 사용법

require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('connected') 

connection.query("set time_zone='Asia/Seoul'") // 한국 시간으로 설정

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(bodyParser.urlencoded({extended: false }))  // body 사용
app.use(express.static(__dirname+'/public'))  // 정적 파일 사용

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/profile', (req, res) => {
  res.render('profile')
})

app.get('/data', (req, res) => {
  res.render('data')
})

app.get('/chat', (req, res) => {
  res.render('chat')
})

app.post('/contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const title = req.body.title;
  const memo = req.body.memo;

  var sql = `insert into chat(name,email,title,memo,regdate)
  values(?,?,?,?,now() )`
  var values = [name,email,title,memo];
  

  connection.query(sql, values, function (err, result) {
    if(err) throw err;
    console.log('자료 1개를 입력했습니다.');
    res.send("<script> alert('문의사항이 등록되었습니다.'); location.href='/';</script>");
  })
  
})
app.get('/chatList', (req, res) => {
  var sql = `select * from chat order by idx desc`
  connection.query(sql, function(err, results, fields){
    if(err) throw err;
    res.render('chatList', {lists:results})
  })
})

app.get('/chatDelete', (req, res) => {
  var idx = req.query.idx
  var sql = `delete from chat where idx='${idx}'`
  connection.query(sql, function (err, result) {
    if(err) throw err;
    res.send("<script> alert('삭제되었습니다.'); location.href='/chatList';</script>");
  })
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/loginProc', (req, res) => {
  const user_id = req.body.user_id;
  const pw = req.body.pw;

  var sql = `select * from member where user_id=? and pw=?`
  var values = [user_id, pw];
  
  connection.query(sql, values, function (err, result) {
    if(err) throw err;
    console.log(result.length)
    res.send(result);
  })
})

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`)
}) 