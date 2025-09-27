const playBtn = document.getElementById("playBtn") as HTMLButtonElement;
const exitBtn = document.getElementById("exitBtn") as HTMLButtonElement;
const nicknameInput = document.getElementById("nickname") as HTMLInputElement;
const roomIdInput = document.getElementById("roomId") as HTMLInputElement;
const errorMsg = document.getElementById("errorMsg") as HTMLParagraphElement;

// Modal elements
const roomsBtn = document.getElementById("roomsBtn") as HTMLButtonElement;
const roomsModal = document.getElementById("roomsModal") as HTMLDivElement;
const closeModal = document.getElementById("closeModal") as HTMLButtonElement;
const createRoomBtn = document.getElementById("createRoomBtn") as HTMLButtonElement;
const roomsList = document.getElementById("roomsList") as HTMLDivElement;

interface RoomInfo {
    playersCount: number;
    maxPlayers: number;
}

// fetch danh sách room
async function fetchRooms(): Promise<Record<string, RoomInfo>> {
    const res = await fetch("/api/rooms");
    return res.json();
}

// Render room từ server
function renderRooms(rooms: Record<string, RoomInfo>): void {
    roomsList.innerHTML = "";
    for (const [id, room] of Object.entries(rooms)) {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-700 rounded p-3";

        let colorClass = "text-gray-400";
        if (room.playersCount <= 3) colorClass = "text-green-400";
        else if (room.playersCount <= 7) colorClass = "text-yellow-400";
        else if (room.playersCount >= room.maxPlayers - 2) colorClass = "text-red-400";

        div.innerHTML = `
            <span class="text-white">Room #${id}</span>
            <span class="${colorClass}">${room.playersCount}/${room.maxPlayers}</span>
            <button class="ml-4 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-bold joinBtn">
                Join
            </button>
        `;

        const joinBtn = div.querySelector(".joinBtn") as HTMLButtonElement;
        joinBtn.addEventListener("click", () => {
            if (room.playersCount >= room.maxPlayers) {
                alert(`⚠️ Room #${id} is full!`);
                return;
            }
            roomIdInput.value = id; // auto fill input
            closeModalWithAnim();
        });

        roomsList.appendChild(div);
    }
}

async function loadRooms(): Promise<void> {
    const rooms = await fetchRooms();
    renderRooms(rooms);
}

// Play button
playBtn.addEventListener("click", async () => {
    const nickname = nicknameInput.value.trim();
    const roomId = roomIdInput.value.trim();

    if (!nickname || !roomId) {
        errorMsg.classList.remove("hidden");
        return;
    }

    // check room tồn tại trước khi join
    const rooms = await fetchRooms();
    if (!rooms[roomId]) {
        alert(`❌ Room ${roomId} does not exist`);
        return;
    }
    if (rooms[roomId].playersCount >= rooms[roomId].maxPlayers) {
        alert(`⚠️ Room ${roomId} is full!`);
        return;
    }

    // Lưu nickname + roomId tạm vào sessionStorage
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("roomId", roomId);

    // Redirect sang game
    window.location.href = "/html/index.html";
});

// Exit button
exitBtn.addEventListener("click", () => {
    window.open("", "_self")?.close();
});

let modalOpen = false;
let refreshInterval: number | null = null;

// Modal open/close with animation
function openModalWithAnim(): void {
    roomsModal.classList.remove("pointer-events-none");
    roomsModal.classList.add("opacity-100");
    const modalBox = roomsModal.querySelector("div") as HTMLDivElement;
    modalBox.classList.remove("scale-90");
    modalBox.classList.add("scale-100");

    modalOpen = true;
    loadRooms();

    if (!refreshInterval) {
        refreshInterval = window.setInterval(() => {
            if (modalOpen) loadRooms();
        }, 3000);
    }
}

function closeModalWithAnim(): void {
    const modalBox = roomsModal.querySelector("div") as HTMLDivElement;
    modalBox.classList.remove("scale-100");
    modalBox.classList.add("scale-90");
    roomsModal.classList.remove("opacity-100");
    roomsModal.classList.add("opacity-0");

    modalOpen = false;
    setTimeout(() => {
        roomsModal.classList.add("pointer-events-none");
    }, 300);
}

// Rooms modal open/close
roomsBtn.addEventListener("click", openModalWithAnim);
closeModal.addEventListener("click", closeModalWithAnim);

// Create Room
createRoomBtn.addEventListener("click", async () => {
    const roomId = Math.random().toString(36).substr(2, 6);
    const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, maxPlayers: 10 }),
    });
    const data = await res.json();
    if ((data as any).error) {
        alert("❌ " + (data as any).error);
    } else {
        await loadRooms(); // reload list
    }
});

// Close modal with ESC key
document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
        closeModalWithAnim();
    }
});

// Close modal when click outside box
roomsModal.addEventListener("click", (e: MouseEvent) => {
    if (e.target === roomsModal) {
        closeModalWithAnim();
    }
});

function toggleBanners(): void {
    const leftBanner = document.getElementById("banner-left") as HTMLDivElement;
    const rightBanner = document.getElementById("banner-right") as HTMLDivElement;

    // Show banners (fade in)
    leftBanner.classList.remove("opacity-0", "pointer-events-none");
    leftBanner.classList.add("opacity-100");
    rightBanner.classList.remove("opacity-0", "pointer-events-none");
    rightBanner.classList.add("opacity-100");

    // Hide after 10s (fade out)
    setTimeout(() => {
        leftBanner.classList.remove("opacity-100");
        leftBanner.classList.add("opacity-0", "pointer-events-none");
        rightBanner.classList.remove("opacity-100");
        rightBanner.classList.add("opacity-0", "pointer-events-none");
    }, 10000);

    // Repeat every 30s
    setTimeout(toggleBanners, 30000);
}

// Start loop after page load
window.addEventListener("load", toggleBanners);