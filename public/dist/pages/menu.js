"use strict";
const playBtn = document.getElementById("playBtn");
const exitBtn = document.getElementById("exitBtn");
const nicknameInput = document.getElementById("nickname");
const roomIdInput = document.getElementById("roomId");
const errorMsg = document.getElementById("errorMsg");
// Modal elements
const roomsBtn = document.getElementById("roomsBtn");
const roomsModal = document.getElementById("roomsModal");
const closeModal = document.getElementById("closeModal");
const createRoomBtn = document.getElementById("createRoomBtn");
const roomsList = document.getElementById("roomsList");
// fetch danh sách room
async function fetchRooms() {
    const res = await fetch("/api/rooms");
    return res.json();
}
// Render room từ server
function renderRooms(rooms) {
    roomsList.innerHTML = "";
    for (const [id, room] of Object.entries(rooms)) {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-700 rounded p-3";
        let colorClass = "text-gray-400";
        if (room.playersCount <= 3)
            colorClass = "text-green-400";
        else if (room.playersCount <= 7)
            colorClass = "text-yellow-400";
        else if (room.playersCount >= room.maxPlayers - 2)
            colorClass = "text-red-400";
        div.innerHTML = `
            <span class="text-white">Room #${id}</span>
            <span class="${colorClass}">${room.playersCount}/${room.maxPlayers}</span>
            <button class="ml-4 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-bold joinBtn">
                Join
            </button>
        `;
        const joinBtn = div.querySelector(".joinBtn");
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
async function loadRooms() {
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
    var _a;
    (_a = window.open("", "_self")) === null || _a === void 0 ? void 0 : _a.close();
});
let modalOpen = false;
let refreshInterval = null;
// Modal open/close with animation
function openModalWithAnim() {
    roomsModal.classList.remove("pointer-events-none");
    roomsModal.classList.add("opacity-100");
    const modalBox = roomsModal.querySelector("div");
    modalBox.classList.remove("scale-90");
    modalBox.classList.add("scale-100");
    modalOpen = true;
    loadRooms();
    if (!refreshInterval) {
        refreshInterval = window.setInterval(() => {
            if (modalOpen)
                loadRooms();
        }, 3000);
    }
}
function closeModalWithAnim() {
    const modalBox = roomsModal.querySelector("div");
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
    if (data.error) {
        alert("❌ " + data.error);
    }
    else {
        await loadRooms(); // reload list
    }
});
// Close modal with ESC key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModalWithAnim();
    }
});
// Close modal when click outside box
roomsModal.addEventListener("click", (e) => {
    if (e.target === roomsModal) {
        closeModalWithAnim();
    }
});
//# sourceMappingURL=menu.js.map