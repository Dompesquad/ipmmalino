// Firebase config
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

document.getElementById("kaderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {
    nama: nama.value,
    angkatan: angkatan.value,
    pktm1: pktm1.value,
    pktm2: pktm2.value,
    lanjutan1: lanjutan1.value,
    lanjutan2: lanjutan2.value,
    jabatan: jabatan.value,
    tahunMenjabat: tahunMenjabat.value,
    kontak: kontak.value,
    alamat: alamat.value,
    waktu: new Date().toISOString()
  };
  db.ref("kader").push(data, () => {
    alert("Data berhasil dikirim!");
    document.getElementById("kaderForm").reset();
  });
});
