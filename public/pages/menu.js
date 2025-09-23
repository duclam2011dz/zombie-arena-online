const playBtn = document.getElementById("playBtn");
const exitBtn = document.getElementById("exitBtn");
const nicknameInput = document.getElementById("nickname");
const roomIdInput = document.getElementById("roomId");
const errorMsg = document.getElementById("errorMsg");

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

exitBtn.addEventListener("click", () => {
    // Trick thoát tab (có thể bị browser chặn)
    window.open('', '_self').close();

    // Nếu không được thì báo message
    alert("Cannot close tab automatically. Please close it manually.");
});