import {Router} from 'express'
const router = Router();


const callback_URL = 'http://localhost:3000/buy/back-from-711';

// 註: 本路由與資料庫無關，單純轉向使用

// POST
router.post('/', function (req, res, next) {
  //console.log(req.body)
  res.redirect(callback_URL + '?' + new URLSearchParams(req.body).toString())
})

// 測試路由用
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'shipment route is OK' })
// })

export default router
