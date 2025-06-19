// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAIW_ugkzambp908lz5hc5OthXvXrdVg4s",
  authDomain: "ipm-kader-database.firebaseapp.com",
  databaseURL: "https://ipm-kader-database-default-rtdb.firebaseio.com",
  projectId: "ipm-kader-database",
  storageBucket: "ipm-kader-database.firebasestorage.app",
  messagingSenderId: "199203359920",
  appId: "1:199203359920:web:fd1b4d28069eb97d317f75"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Dropdown angkatan 1–68 otomatis
const angkatanDropdown = document.getElementById("angkatanDropdown");
for (let i = 1; i <= 68; i++) {
  const option = document.createElement("option");
  option.value = `Angkatan ${i}`;
  option.textContent = `Angkatan ${i}`;
  angkatanDropdown.appendChild(option);
}

// Tangani submit form
const form = document.getElementById("kaderForm");
const suksesMsg = document.getElementById("suksesMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  db.ref("data_kader").push(data)
    .then(() => {
      suksesMsg.classList.remove("hidden");
      form.reset();
      window.scrollTo(0, 0);
    })
    .catch((error) => {
      alert("❌ Gagal mengirim data: " + error.message);
    });
});
