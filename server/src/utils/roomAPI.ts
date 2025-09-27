// server/src/utils/roomAPI.js
import express from "express";

interface RoomManager {
    getRooms: () => any;
    rooms: Map<string, unknown>;
    createRoom: (roomId: string, maxPlayers?: number) => void;
}

export function createRoomAPI(roomManager: RoomManager) {
    const router = express.Router();

    // Lấy danh sách rooms
    router.get("/rooms", (_req, res): void => {
        res.json(roomManager.getRooms());
    });

    // Tạo room mới
    router.post("/rooms", (req, res): void => {
        const { roomId, maxPlayers = 10 } = req.body as {
            roomId?: string;
            maxPlayers?: number;
        };

        if (!roomId) {
            res.status(400).json({ error: "Missing roomId" });
            return;
        }

        if (roomManager.rooms.has(roomId)) {
            res.status(400).json({ error: "Room already exists" });
            return;
        }

        roomManager.createRoom(roomId, maxPlayers);
        res.json({ success: true, roomId });
    });

    return router;
}