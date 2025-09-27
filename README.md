# 🧟 Zombie Arena Online

**Zombie Arena Online** là một web game bắn zombie **top-down 2D** dạng multiplayer realtime được xây dựng bằng **HTML, Tailwind CSS, TypeScript** cho client và **Node.js, Express.js, WebSocket (raw)** cho server.
Dự án được tổ chức theo phong cách module-based cả client và server để dễ dàng mở rộng và maintain.

---

## 🚀 Phiên bản mới nhất: v1.1

### 🔑 Các tính năng chính
- Multiplayer realtime với **WebSocket** (server-side bằng Node.js + Express).
- **Room system**:
  - Người chơi có thể tạo/join room bằng nickname.
  - Rooms list hiển thị số lượng người chơi theo thời gian thực.
  - Chặn join nếu room đã full (10/10).
- **Interpolation**: giảm lag, di chuyển mượt mà hơn khi có latency.
- Nickname hiển thị trực tiếp dưới mỗi player.
- Ping indicator (màu xanh/vàng/đỏ theo độ trễ).
- UI/UX:
  - Menu với modal Rooms List (ESC/click outside để đóng).
  - Auto điền room id khi Join.
  - Fake rooms demo để skeleton UI.
- **Client đã migrate 100% sang TypeScript** để dễ maintain.

---

## 🚀 Tech Stack

### Client
- **HTML5 Canvas**: render bản đồ, player, bullet.
- **Tailwind CSS (CDN)**: styling nhanh, gọn.
- **TypeScript**: logic gameplay, local engine, network engine.
- **SessionStorage**: lưu tạm nickname & room id từ menu.

### Server
- **Node.js + Express.js**: serve static files.
- **WebSocket (ws)**: xử lý realtime multiplayer.
- **uuid**: tạo player id duy nhất.
- **chalk**: in log màu mè, dễ debug.
- **RoomManager**: quản lý phòng chơi.

---

## 📂 Workspace (v1.1)

```
📂public
┣ 📂dist
┃ ┣ 📂pages
┃ ┃ ┣ 📜menu.js
┃ ┃ ┗ 📜menu.js.map
┃ ┗ 📂src
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┣ 📜bullet.js
┃ ┃ ┃ ┣ 📜bullet.js.map
┃ ┃ ┃ ┣ 📜player.js
┃ ┃ ┃ ┗ 📜player.js.map
┃ ┃ ┣ 📂core
┃ ┃ ┃ ┣ 📜LocalEngine.js
┃ ┃ ┃ ┣ 📜LocalEngine.js.map
┃ ┃ ┃ ┣ 📜NetworkEngine.js
┃ ┃ ┃ ┗ 📜NetworkEngine.js.map
┃ ┃ ┣ 📂utils
┃ ┃ ┃ ┣ 📜camera.js
┃ ┃ ┃ ┣ 📜camera.js.map
┃ ┃ ┃ ┣ 📜input.js
┃ ┃ ┃ ┣ 📜input.js.map
┃ ┃ ┃ ┣ 📜interpolation.js
┃ ┃ ┃ ┣ 📜interpolation.js.map
┃ ┃ ┃ ┣ 📜map.js
┃ ┃ ┃ ┗ 📜map.js.map
┃ ┃ ┣ 📜game.js
┃ ┃ ┗ 📜game.js.map
┣ 📂html
┃ ┣ 📜index.html
┃ ┗ 📜menu.html
┣ 📂pages
┃ ┗ 📜menu.ts
┣ 📂src
┃ ┣ 📂components
┃ ┃ ┣ 📜bullet.ts
┃ ┃ ┗ 📜player.ts
┃ ┣ 📂core
┃ ┃ ┣ 📜LocalEngine.ts
┃ ┃ ┗ 📜NetworkEngine.ts
┃ ┣ 📂utils
┃ ┃ ┣ 📜camera.ts
┃ ┃ ┣ 📜input.ts
┃ ┃ ┣ 📜interpolation.ts
┃ ┃ ┗ 📜map.ts
┃ ┗ 📜game.ts
┣ 📜package-lock.json
┣ 📜package.json
┗ 📜tsconfig.client.json
📂server
┣ 📂src
┃ ┣ 📂components
┃ ┃ ┗ 📜players.js
┃ ┣ 📂core
┃ ┃ ┣ 📜NetworkEngine.js
┃ ┃ ┗ 📜RoomManager.js
┃ ┗ 📂utils
┃ ┃ ┣ 📜logging.js
┃ ┃ ┣ 📜roomAPI.js
┃ ┃ ┗ 📜wsWrapper.js
┣ 📜index.js
┣ 📜package-lock.json
┗ 📜package.json
📜.gitignore
📜README.md
```

---

## ▶️ Cách chạy dự án

1. Clone repo về máy.  
2. Cài đặt dependencies cho client:
   ```bash
   cd public
   npm install
   npm run build
   ```
3. Cài đặt dependencies cho server:
   ```bash
   cd ../server
   npm install
   ```
4. Chạy server:
   ```
   npm start
   ```
5. Mở trình duyệt:
   ```
   http://localhost:3000
   ```
6. Bạn sẽ thấy **menu screen** → nhập nickname + room id (hoặc tạo room) → nhấn **Play** → vào game.  

---

## 🧭 Roadmap v1.1.5
- Migrate server code sang TypeScript.
- Thêm joystick support cho mobile.
- Tích hợp ads system.
- Clean up & optimize room logic.

---

📌 Changelog: các phiên bản cũ (ví dụ v1.0) được lưu tại CHANGELOG.md.