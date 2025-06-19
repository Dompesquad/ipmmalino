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
const storage = firebase.storage();

const form = document.getElementById("kaderForm");
const suksesMsg = document.getElementById("suksesMsg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const file = form.foto.files[0];

  const data = {
    nama: form.nama.value,
    angkatan: form.angkatan.value,
    tahun_pktm1: form.tahun_pktm1.value,
    tahun_pktm2: form.tahun_pktm2.value,
    tingkat_lanjutan1: form.tingkat_lanjutan1.value,
    tingkat_lanjutan2: form.tingkat_lanjutan2.value,
    jabatan: form.jabatan.value,
    tahun_menjabat: form.tahun_menjabat.value,
    hp: form.hp.value,
    alamat: form.alamat.value,
    foto: ""
  };

  try {
    if (file) {
      const ref = storage.ref("foto_kader/" + Date.now() + "_" + file.name);
      const snapshot = await ref.put(file);
      const url = await snapshot.ref.getDownloadURL();
      data.foto = url;
    }
    await db.ref("data_kader").push(data);
    suksesMsg.classList.remove("hidden");
    form.reset();
    setTimeout(() => suksesMsg.classList.add("hidden"), 3000);
  } catch (err) {
    alert("Gagal: " + err.message);
  }
});
