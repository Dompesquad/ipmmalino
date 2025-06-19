const firebaseConfig = {
  apiKey: "AIzaSyAIW_ugkzambp908lz5hc5OthXvXrdVg4s",
  authDomain: "ipm-kader-database.firebaseapp.com",
  projectId: "ipm-kader-database",
  storageBucket: "ipm-kader-database.appspot.com",
  messagingSenderId: "199203359920",
  appId: "1:199203359920:web:fd1b4d28069eb97d317f75"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("kaderForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const fotoFile = form.foto.files[0];

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

  try {
    if (fotoFile) {
      const storageRef = storage.ref("foto_kader/" + Date.now() + "_" + fotoFile.name);
      const snapshot = await storageRef.put(fotoFile);
      const fotoURL = await snapshot.ref.getDownloadURL();
      data.foto = fotoURL;
    } else {
      data.foto = "";
    }

    await db.collection("kader_ipm").add(data);
    document.getElementById("suksesMsg").classList.remove("hidden");
    form.reset();
  } catch (error) {
    alert("❌ Gagal menyimpan data: " + error.message);
  }
});
