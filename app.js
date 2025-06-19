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

document.getElementById("kaderForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const statusEl = document.getElementById("status");
  statusEl.textContent = "⏳ Mengirim data...";

  const data = {
    nama: nama.value,
    angkatan: angkatan.value,
    pktm1: pktm1.value,
    pktm2: pktm2.value,
    lanjutan1: lanjutan1.value,
    lanjutan2: lanjutan2.value,
    jabatan: jabatan.value,
    tahunJabat: tahunJabat.value,
    wa: wa.value,
    alamat: alamat.value
  };

  try {
    const file = foto.files[0];
    if (file) {
      const storageRef = storage.ref('fotos/' + Date.now() + "_" + file.name);
      await storageRef.put(file);
      const url = await storageRef.getDownloadURL();
      data.fotoUrl = url;
    }

    await db.ref("kader").push(data);
    document.getElementById("kaderForm").reset();
    statusEl.textContent = "✅ Data berhasil terkirim!";

    setTimeout(() => {
      statusEl.textContent = "";
    }, 5000);
  } catch (err) {
    statusEl.textContent = "❌ Gagal mengirim data.";
    console.error(err);
  }
});
