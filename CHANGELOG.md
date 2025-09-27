# 📜 Changelog - Zombie Arena Online

## [1.1] - 2025-09-27
### Added
- **Room system**: tạo/join room, rooms list, chặn join khi room full.
- **Interpolation**: chuyển động mượt mà hơn khi latency cao.
- **Nickname hiển thị** dưới player và sync từ server.
- **UI/UX improvements**:
  - Modal rooms list (ESC/click outside để đóng).
  - Auto điền room id khi Join.
  - Skeleton rooms demo.
- **Client migrated 100% sang TypeScript**.
- CI/CD setup trên Render: auto build client khi deploy.

---

## [1.0] - 2025-09-25
### Added
- **Multiplayer realtime** với raw WebSocket.
- **Player movement + shooting** (local bullets sync lên server).
- **Basic state sync** (x, y, angle).
- **Basic canvas rendering**: map grid, player, bullets.
- **Menu screen**: nhập nickname, room id (chưa có room system).
- **Ping indicator** (xanh/vàng/đỏ).
- Client còn dùng **JavaScript thuần**.