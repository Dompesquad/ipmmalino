// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAIW_ugkzambp908lz5hc5OthXvXrdVg4s",
  authDomain: "ipm-kader-database.firebaseapp.com",
  databaseURL: "https://ipm-kader-database-default-rtdb.firebaseio.com",
  projectId: "ipm-kader-database",
  storageBucket: "ipm-kader-database.appspot.com",
  messagingSenderId: "199203359920",
  appId: "1:199203359920:web:fd1b4d28069eb97d317f75"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Submit form evaluasi
const form = document.getElementById("evalForm");
const suksesMsg = document.getElementById("suksesMsg");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    nama: form.nama.value,
    kegiatan: form.kegiatan.value,
    fasilitator: form.fasilitator.value,
    panitia: form.panitia.value,
    saran: form.saran.value || ""
  };

  // Tambahkan materi 1–13
  for (let i = 1; i <= 13; i++) {
    data[`materi${i}`] = form[`materi${i}`].value;
  }

  db.ref("evaluasi_kegiatan").push(data, function(error) {
    if (error) {
      alert("❌ Gagal mengirim data: " + error.message);
    } else {
      suksesMsg.classList.remove("hidden");
      form.reset();
      setTimeout(() => {
        suksesMsg.classList.add("hidden");
      }, 5000);
    }
  });
});
