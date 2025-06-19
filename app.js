// Firebase Config
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

// Tangani submit form
const form = document.getElementById("kaderForm");
const suksesMsg = document.getElementById("suksesMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    nama: form.nama.value,
    angkatan: form.angkatan.value,
    tahun_pktm1: form.tahun_pktm1.value,
    tahun_pktm2: form.tahun_pktm2.value || "",
    tingkat_lanjutan1: form.tingkat_lanjutan1.value || "",
    tingkat_lanjutan2: form.tingkat_lanjutan2.value || "",
    jabatan: form.jabatan.value || "",
    tahun_menjabat: form.tahun_menjabat.value || "",
    hp: form.hp.value,
    alamat: form.alamat.value
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
