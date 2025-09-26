// server/src/utils/roomAPI.js
import express from "express";

export function createRoomAPI(roomManager) {
    const router = express.Router();

    // Lấy danh sách rooms
    router.get("/rooms", (req, res) => {
        res.json(roomManager.getRooms());
    });

    // Tạo room mới
    router.post("/rooms", (req, res) => {
        const { roomId, maxPlayers = 10 } = req.body;
        if (!roomId) return res.status(400).json({ error: "Missing roomId" });

        if (roomManager.rooms.has(roomId)) {
            return res.status(400).json({ error: "Room already exists" });
        }

        roomManager.createRoom(roomId, maxPlayers);
        res.json({ success: true, roomId });
    });

    return router;
}