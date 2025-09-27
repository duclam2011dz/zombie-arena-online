// server/src/utils/roomAPI.js
import express, { Request, Response } from "express";

interface RoomManager {
    getRooms: () => any;
    rooms: Map<string, unknown>;
    createRoom: (roomId: string, maxPlayers?: number) => void;
}

export function createRoomAPI(roomManager: RoomManager) {
    const router = express.Router();

    // Lấy danh sách rooms
    router.get("/rooms", (_req: Request, res: Response) => {
        res.json(roomManager.getRooms());
    });

    // Tạo room mới
    router.post("/rooms", (req: Request, res: Response) => {
        const { roomId, maxPlayers = 10 } = req.body as {
            roomId?: string;
            maxPlayers?: number;
        };

        if (!roomId) return res.status(400).json({ error: "Missing roomId" });

        if (roomManager.rooms.has(roomId)) {
            return res.status(400).json({ error: "Room already exists" });
        }

        roomManager.createRoom(roomId, maxPlayers);
        res.json({ success: true, roomId });
    });

    return router;
}