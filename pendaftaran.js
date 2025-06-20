// Firebase
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

const form = document.getElementById("daftarForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    nama: form.nama.value,
    ttl: form.ttl.value,
    asal_sekolah: form.asal_sekolah.value,
    acara: form.acara.value,
    tujuan: form.tujuan.value,
    nama_ortu: form.nama_ortu.value,
    hp: form.hp.value
  };

  db.ref("data_pendaftaran").push(data, function(error) {
    if (error) {
      alert("❌ Gagal menyimpan: " + error.message);
    } else {
      msg.classList.remove("hidden");
      form.reset();
      setTimeout(() => msg.classList.add("hidden"), 5000);
    }
  });
});
