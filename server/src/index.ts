import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import { NetworkEngine } from "./core/NetworkEngine";
import { createRoomAPI } from "./utils/roomAPI";
import { logInfo } from "./utils/logging";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
const server = createServer(app);

// Serve static
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/html/menu.html"));
});

// Tạo NetworkEngine
const network = new NetworkEngine(server);

// mount API
app.use("/api", createRoomAPI(network.roomManager));

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    logInfo(`Server running at http://localhost:${PORT}`);
});