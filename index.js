import app from "./express.js";

const PORT = 3005;
const ROOT = "http://localhost";

//================== 監聽設置
app.listen(PORT, () => {
  console.log(`連線服務已運行於: ${ROOT}:${PORT}`);
})