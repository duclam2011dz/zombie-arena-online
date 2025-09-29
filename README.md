# 🧟 Zombie Arena Online

**Zombie Arena Online** là một web game bắn zombie **top-down 2D** dạng multiplayer realtime được xây dựng bằng **HTML, Tailwind CSS, TypeScript** cho client và **Node.js, Express.js, WebSocket (raw)** cho server.  
Dự án được tổ chức theo phong cách module-based cả client và server để dễ dàng mở rộng và maintain.

---

## 🚀 Phiên bản mới nhất: v1.1.5

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
- **Zombie system**:
  - Zombie spawn theo từng phòng.
  - Có thanh máu hiển thị trực tiếp trên đầu.
  - Đạn player trúng zombie → zombie mất máu, hết máu thì biến mất.
- **Bullets sync**: đạn của tất cả player được đồng bộ qua server, không còn local-only.
- **Ads banner demo**: banner hiển thị ở menu screen, auto fade in/out.
- **Client + Server đã migrate 100% sang TypeScript** để dễ maintain.

---

## 🚀 Tech Stack

### Client
- **HTML5 Canvas**: render bản đồ, player, bullet, zombie.
- **Tailwind CSS (CDN)**: styling nhanh, gọn.
- **TypeScript**: logic gameplay, local engine, network engine.
- **SessionStorage**: lưu tạm nickname & room id từ menu.

### Server
- **Node.js + Express.js**: serve static files.
- **WebSocket (ws)**: xử lý realtime multiplayer.
- **uuid**: tạo player id duy nhất.
- **chalk**: in log màu mè, dễ debug.
- **RoomManager**: quản lý phòng chơi.
- **ZombieManager**: quản lý logic spawn & state zombie.

---

## 📂 Workspace (v1.1.5)

📦Day3
┣ 📂public
┃ ┣ 📂dist
┃ ┃ ┣ 📂pages
┃ ┃ ┃ ┣ 📜menu.js
┃ ┃ ┃ ┣ 📜menu.js.map
┃ ┃ ┃ ┣ 📜settings.js
┃ ┃ ┃ ┗ 📜settings.js.map
┃ ┃ ┗ 📂src
┃ ┃ ┃ ┣ 📂components
┃ ┃ ┃ ┃ ┣ 📜bullet.js
┃ ┃ ┃ ┃ ┣ 📜bullet.js.map
┃ ┃ ┃ ┃ ┣ 📜player.js
┃ ┃ ┃ ┣ 📜player.js.map
┃ ┃ ┃ ┃ ┣ 📜zombies.js
┃ ┃ ┃ ┃ ┗ 📜zombies.js.map
┃ ┃ ┃ ┣ 📂core
┃ ┃ ┃ ┃ ┣ 📜LocalEngine.js
┃ ┃ ┃ ┃ ┣ 📜LocalEngine.js.map
┃ ┃ ┃ ┃ ┣ 📜NetworkEngine.js
┃ ┃ ┃ ┃ ┗ 📜NetworkEngine.js.map
┃ ┃ ┃ ┣ 📂utils
┃ ┃ ┃ ┃ ┣ 📜camera.js
┃ ┃ ┃ ┃ ┣ 📜camera.js.map
┃ ┃ ┃ ┃ ┣ 📜input.js
┃ ┃ ┃ ┃ ┣ 📜input.js.map
┃ ┃ ┃ ┃ ┣ 📜interpolation.js
┃ ┃ ┃ ┃ ┣ 📜interpolation.js.map
┃ ┃ ┃ ┃ ┣ 📜joystick.js
┃ ┃ ┃ ┃ ┣ 📜joystick.js.map
┃ ┃ ┃ ┃ ┣ 📜map.js
┃ ┃ ┃ ┃ ┣ 📜map.js.map
┃ ┃ ┃ ┃ ┣ 📜prediction.js
┃ ┃ ┃ ┃ ┗ 📜prediction.js.map
┃ ┃ ┃ ┣ 📜game.js
┃ ┃ ┃ ┗ 📜game.js.map
┃ ┣ 📂html
┃ ┃ ┣ 📜index.html
┃ ┃ ┗ 📜menu.html
┃ ┣ 📂pages
┃ ┃ ┗ 📜menu.ts
┃ ┣ 📂src
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┣ 📜bullet.ts
┃ ┃ ┃ ┣ 📜player.ts
┃ ┃ ┃ ┗ 📜zombies.ts
┃ ┃ ┣ 📂core
┃ ┃ ┃ ┣ 📜LocalEngine.ts
┃ ┃ ┃ ┗ 📜NetworkEngine.ts
┃ ┃ ┣ 📂utils
┃ ┃ ┃ ┣ 📜camera.ts
┃ ┃ ┃ ┣ 📜input.ts
┃ ┃ ┃ ┣ 📜interpolation.ts
┃ ┃ ┃ ┣ 📜map.ts
┃ ┃ ┃ ┗ 📜prediction.ts
┃ ┃ ┗ 📜game.ts
┃ ┣ 📜package-lock.json
┃ ┣ 📜package.json
┃ ┗ 📜tsconfig.client.json
┣ 📂server
┃ ┣ 📂dist
┃ ┃ ┗ 📂src
┃ ┃ ┃ ┣ 📂components
┃ ┃ ┃ ┃ ┣ 📜players.js
┃ ┃ ┃ ┃ ┗ 📜zombies.js
┃ ┃ ┃ ┣ 📂core
┃ ┃ ┃ ┃ ┣ 📜NetworkEngine.js
┃ ┃ ┃ ┃ ┣ 📜RoomManager.js
┃ ┃ ┃ ┃ ┗ 📜ZombieManager.js
┃ ┃ ┃ ┣ 📂utils
┃ ┃ ┃ ┃ ┣ 📜logging.js
┃ ┃ ┃ ┃ ┣ 📜roomAPI.js
┃ ┃ ┃ ┃ ┗ 📜wsWrapper.js
┃ ┃ ┃ ┗ 📜index.js
┃ ┣ 📂src
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┣ 📜players.ts
┃ ┃ ┃ ┗ 📜zombies.ts
┃ ┃ ┣ 📂core
┃ ┃ ┃ ┣ 📜NetworkEngine.ts
┃ ┃ ┃ ┣ 📜RoomManager.ts
┃ ┃ ┃ ┗ 📜ZombieManager.ts
┃ ┃ ┣ 📂utils
┃ ┃ ┃ ┣ 📜logging.ts
┃ ┃ ┃ ┣ 📜roomAPI.ts
┃ ┃ ┃ ┗ 📜wsWrapper.ts
┃ ┃ ┗ 📜index.ts
┃ ┣ 📜package-lock.json
┃ ┣ 📜package.json
┃ ┗ 📜tsconfig.server.json
┣ 📜.gitignore
┣ 📜CHANGELOG.md
┣ 📜package.json
┗ 📜README.md

---

## 🧭 Roadmap v1.2
- Tối ưu lại gameplay local bằng cách cải thiện **prediction** (cho player và bullet).
- Chuyển player từ local update sang prediction để đồng bộ hơn giữa client-server.
- Cho **zombie di chuyển và tấn công**.
- Thêm **thanh máu cho player**, bị zombie chạm sẽ trừ máu.
- Cân bằng tốc độ bullet vs player.
- Nghiên cứu hệ thống vật phẩm (items, heal, power-ups).