# 📜 Changelog - Zombie Arena Online

## [1.1.5] - 2025-09-xx

### Added

- **TypeScript build setup cho server**:
  - Thêm `server/tsconfig.server.json` với `ESNext module`.
  - Cài đặt sẵn `@types` cho `chalk`, `express`, `uuid`, `ws`.
- **Root package.json**:
  - Thêm script `build:client`, `build:server`, `start:server`, `build` (build toàn bộ dự án từ root).
- **Zombie system**:
  - Thêm `ZombieManager.ts` quản lý spawn zombie theo từng room.
  - Thêm `zombies.ts` (server & client) để wrap logic.
  - Zombie có HP với thanh máu hiển thị.
  - Zombie bị trúng đạn sẽ mất máu (–10 HP), hết máu thì biến mất.
- **Bullets sync**:
  - Đạn bắn ra được đồng bộ toàn bộ giữa các client (không còn local-only).
- **Fake ads banners**:
  - Banner hiển thị trong menu (ảnh full-width), tự động fade in/out.

### Changed

- **Server code đã migrate 100% sang TypeScript**:
  - `index.ts`, `RoomManager.ts`, `NetworkEngine.ts`, `ZombieManager.ts`, `players.ts`, `zombies.ts`, `roomAPI.ts`, `logging.ts`, `wsWrapper.ts`.
  - Toàn bộ server chạy với import/export chuẩn NodeNext.
- **Build output**: server build vào `dist/src/...`.
- **TypeScript config**:
  - Tắt `allowJs`, `checkJs` (không còn code JS).
  - Bật các rule nghiêm ngặt hơn: `strictNullChecks`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`.

### Fixed

- Sửa handler Express trong `roomAPI.ts` để hợp lệ với strict mode.
- Sửa `index.ts` để resolve đúng `public` path sau khi build (`../../..`), tránh lỗi 404 khi serve static HTML.
- Fix lỗi zombie không sync state giữa client/server.
- Fix bullets hiển thị local-only (giờ đồng bộ được tất cả client).

---

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