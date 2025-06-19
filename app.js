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

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Form handler
const form = document.getElementById("kaderForm");
const suksesMsg = document.getElementById("suksesMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    nama: form.nama.value.trim(),
    angkatan: form.angkatan.value.trim(),
    tahun_pktm1: form.tahun_pktm1.value.trim(),
    tahun_pktm2: form.tahun_pktm2.value.trim() || "",
    tingkat_lanjutan1: form.tingkat_lanjutan1.value.trim() || "",
    tingkat_lanjutan2: form.tingkat_lanjutan2.value.trim() || "",
    jabatan: form.jabatan.value.trim() || "",
    tahun_menjabat: form.tahun_menjabat.value.trim() || "",
    hp: form.hp.value.trim(),
    alamat: form.alamat.value.trim()
  };

  db.ref("data_kader").push(data, function (error) {
    if (error) {
      alert("❌ Gagal menyimpan data: " + error.message);
    } else {
      suksesMsg.textContent = "✅ Data berhasil dikirim!";
      suksesMsg.classList.remove("hidden");
      form.reset();
      setTimeout(() => {
        suksesMsg.classList.add("hidden");
      }, 5000);
    }
  });
});
