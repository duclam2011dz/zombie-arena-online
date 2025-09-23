# 🧟 Zombie Arena Online

Một web game bắn zombie **top-down 2D** dạng multiplayer được xây dựng bằng **HTML, Tailwind CSS, JavaScript** cho client và **Node.js, Express.js, WebSocket (raw)** cho server.  
Dự án được tổ chức theo phong cách module-based cả client và server để dễ dàng mở rộng và maintain.

---

## 🚀 Tech Stack

### Client
- **HTML5 Canvas**: render bản đồ, player, bullet.
- **Tailwind CSS**: styling nhanh, gọn, chuẩn Gen Z.
- **JavaScript (ES Module)**: logic gameplay, local engine, network engine.
- **SessionStorage**: lưu tạm nickname & room id từ menu.

### Server
- **Node.js + Express.js**: serve static files.
- **WebSocket (ws)**: xử lý realtime multiplayer.
- **uuid**: tạo player id duy nhất.
- **chalk**: in log màu mè, dễ debug.

---

## 📂 Workspace

```
📂public
 ┃ ┣ 📂html
 ┃ ┃ ┣ 📜index.html
 ┃ ┃ ┗ 📜menu.html
 ┃ ┣ 📂pages
 ┃ ┃ ┗ 📜menu.js
 ┃ ┗ 📂src
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜bullet.js
 ┃ ┃ ┃ ┗ 📜player.js
 ┃ ┃ ┣ 📂core
 ┃ ┃ ┃ ┣ 📜LocalEngine.js
 ┃ ┃ ┃ ┗ 📜NetworkEngine.js
 ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┣ 📜camera.js
 ┃ ┃ ┃ ┣ 📜input.js
 ┃ ┃ ┃ ┗ 📜map.js
 ┃ ┃ ┗ 📜game.js
📂server
 ┣ 📂src 
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┗ 📜players.js
 ┃ ┃ ┣ 📂core
 ┃ ┃ ┃ ┗ 📜NetworkEngine.js
 ┃ ┃ ┗ 📂utils
 ┃ ┃ ┃ ┣ 📜logging.js
 ┃ ┃ ┃ ┗ 📜wsWrapper.js
 ┃ ┣ 📜index.js
 ┃ ┣ 📜package-lock.json
 ┃ ┗ 📜package.json
```

---

## ✅ Ưu điểm
- Codebase **module hóa**, dễ maintain, dễ scale.  
- **Client–server tách biệt rõ ràng**, sync realtime qua WebSocket.  
- Có **menu UI** (nickname, room id, play/exit).  
- **Ping indicator** realtime (ms + màu theo độ lag).  
- Logging có màu bằng **chalk** giúp dễ theo dõi server.  
- Dùng **sessionStorage** để lưu tạm data → reset khi reload tab.

## ⚠️ Nhược điểm
- Chưa có **zombie AI** (mới chỉ player sync).  
- Tạm thời chưa có **room management** (tất cả player chung 1 pool).  
- Chưa có cơ chế **anti-cheat** hay validate mạnh từ server.  
- Map/grid còn đơn giản, chưa có vật cản hay tile-based logic.

## 🔧 Điểm cần cải tiến
- Tách `rooms.js` để quản lý nhiều phòng chơi (theo roomId).  
- Thêm entity zombie, item, skill.  
- Tối ưu sync state (giảm payload, dùng snapshot diff).  
- Thêm build tool (Vite/Webpack) thay vì load file ES module trực tiếp.  
- Deploy production (pm2, nginx reverse proxy).

---

## ▶️ Cách chạy dự án

1. Clone repo về máy.  
2. Cài đặt dependencies (vào thư mục `server/`):  
   ```bash
   cd server
   npm install
   ```
3. Chạy server:  
   ```bash
   npm start
   ```
4. Mở trình duyệt:  
   ```
   http://localhost:3000
   ```
5. Bạn sẽ thấy **menu screen** → nhập nickname + room id → nhấn **Play** → vào game.  

---

## 🧪 Demo Features
- Di chuyển bằng **WASD**, bắn bằng **chuột trái**.  
- Player sync realtime qua server.  
- Ping hiển thị ở góc phải dưới.  
- Nút **Exit Game** trong menu để thoát tab (hoặc báo message nếu browser chặn).  

---

💡 Đây là **phiên bản đầu tiên (MVP)**, đủ để backup và tiếp tục scale trong tương lai.
