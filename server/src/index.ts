import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import { NetworkEngine } from "./core/NetworkEngine.js";
import { createRoomAPI } from "./utils/roomAPI.js";
import { logInfo } from "./utils/logging.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "../../..");
const publicPath = path.join(rootDir, "public");

const app = express();
app.use(express.json());
const server = createServer(app);

// Serve static
app.use(express.static(publicPath));
app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, "html/menu.html"));
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