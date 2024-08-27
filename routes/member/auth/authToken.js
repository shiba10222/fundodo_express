import jwt from 'jsonwebtoken';

//================== 中介函數來驗證 Token ==================//
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Received token:', token); // 添加這行來檢查接收到的令牌
    if (token == null) return res.sendStatus(401); // Token 缺失返回 401
  
    jwt.verify(token, process.env.JWT_SECRET ,(err, user) => {
      if (err) return res.sendStatus(403);
      console.log('Decoded user:', user); // 添加日誌
      req.user = user;
      next();
    });
  };

  export default authenticateToken;