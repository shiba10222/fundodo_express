import jwt from 'jsonwebtoken';

//================== 中介函數來驗證 Token ==================//
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401); // Token 缺失返回 401
  
    jwt.verify(token, process.env.JWT_SECRET ,(err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  export default authenticateToken;