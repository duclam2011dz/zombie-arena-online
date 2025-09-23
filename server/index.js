import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { NetworkEngine } from "./src/core/NetworkEngine.js";
import { logInfo } from "./src/utils/logging.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Serve static
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/menu.html"));
});

// Tạo NetworkEngine
new NetworkEngine(server);

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    logInfo(`Server running at http://localhost:${PORT}`);
});