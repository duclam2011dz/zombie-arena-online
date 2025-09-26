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

const fakeRooms = [
    { id: "1234", players: 2, max: 10 },
    { id: "5678", players: 0, max: 10 },
    { id: "9999", players: 8, max: 10 },
    { id: "4242", players: 10, max: 10 },
];

// Helper: chọn màu cho player count
function getPlayerCountColor(players, max) {
    if (players <= 3) return "text-green-400"; // ít người
    if (players <= 7) return "text-yellow-400"; // trung bình
    if (players >= max - 2) return "text-red-400"; // gần đầy
    return "text-gray-400"; // fallback
}

// Render fake rooms
function renderRooms() {
    roomsList.innerHTML = "";
    fakeRooms.forEach((room) => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-700 rounded p-3";

        const colorClass = getPlayerCountColor(room.players, room.max);

        div.innerHTML = `
            <span class="text-white">Room #${room.id}</span>
            <span class="${colorClass}">${room.players}/${room.max}</span>
            <button class="ml-4 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-bold joinBtn">
                Join
            </button>
        `;

        // Join button handler
        div.querySelector(".joinBtn").addEventListener("click", () => {
            if (room.players >= room.max) {
                alert(`⚠️ Room #${room.id} is full! Cannot join.`);
                return;
            }
            roomIdInput.value = room.id; // auto fill
            closeModalWithAnim(); // close modal
        });

        roomsList.appendChild(div);
    });
}
renderRooms();

// Play button
playBtn.addEventListener("click", () => {
    const nickname = nicknameInput.value.trim();
    const roomId = roomIdInput.value.trim();

    if (!nickname || !roomId) {
        errorMsg.classList.remove("hidden");
        return;
    }

    // Lưu nickname + roomId tạm vào sessionStorage (sau này game lấy ra dùng)
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("roomId", roomId);

    // Redirect sang game
    window.location.href = "/html/index.html";
});

// Exit button
exitBtn.addEventListener("click", () => {
    window.open("", "_self").close();
});

// Modal open/close with animation
function openModalWithAnim() {
    roomsModal.classList.remove("pointer-events-none");
    roomsModal.classList.add("opacity-100");
    const modalBox = roomsModal.querySelector("div");
    modalBox.classList.remove("scale-90");
    modalBox.classList.add("scale-100");
}

function closeModalWithAnim() {
    const modalBox = roomsModal.querySelector("div");
    modalBox.classList.remove("scale-100");
    modalBox.classList.add("scale-90");
    roomsModal.classList.remove("opacity-100");
    roomsModal.classList.add("opacity-0");

    // disable pointer events after animation ends
    setTimeout(() => {
        roomsModal.classList.add("pointer-events-none");
    }, 300);
}

// Rooms modal open/close
roomsBtn.addEventListener("click", openModalWithAnim);
closeModal.addEventListener("click", closeModalWithAnim);

createRoomBtn.addEventListener("click", () => {
    alert("Create Room feature coming soon!");
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