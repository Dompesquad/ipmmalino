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
const database = firebase.database();
const storage = firebase.storage();

document.getElementById("kaderForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const notif = document.getElementById("notif");

  const nama = document.getElementById("nama").value.trim();
  const angkatan = document.getElementById("angkatan").value.trim();
  const tahunPKTM1 = document.getElementById("tahunPKTM1").value.trim();
  const alamat = document.getElementById("alamat").value.trim();

  if (!nama || !angkatan || !tahunPKTM1 || !alamat) {
    notif.textContent = "⚠️ Harap isi semua field yang wajib (*)!";
    notif.style.color = "red";
    return;
  }

  const fotoFile = document.getElementById("foto").files[0];
  let fotoURL = "";

  if (fotoFile) {
    const fotoRef = storage.ref('foto_kader/' + Date.now() + '_' + fotoFile.name);
    try {
      const snapshot = await fotoRef.put(fotoFile);
      fotoURL = await snapshot.ref.getDownloadURL();
    } catch (err) {
      notif.textContent = "❌ Gagal mengupload foto.";
      notif.style.color = "red";
      return;
    }
  }

  const data = {
    nama,
    angkatan,
    tahunPKTM1,
    tahunPKTM2: document.getElementById("tahunPKTM2").value.trim(),
    programLanjutan: document.getElementById("programLanjutan").value.trim(),
    pimpinanCabang: document.getElementById("pimpinanCabang").value.trim(),
    nohp: document.getElementById("nohp").value.trim(),
    alamat,
    foto: fotoURL
  };

  const dataRef = database.ref("kader").push();
  dataRef.set(data, function (error) {
    if (error) {
      notif.textContent = "❌ Gagal mengirim data.";
      notif.style.color = "red";
    } else {
      notif.textContent = "✅ Data berhasil terkirim!";
      notif.style.color = "green";
      document.getElementById("kaderForm").reset();
    }
  });
});
