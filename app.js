// Konfigurasi Firebase (pastikan sesuai)
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

// Ambil elemen form
document.getElementById("kaderForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const angkatan = document.getElementById("angkatan").value;
  const pktm1 = document.getElementById("pktm1").value;
  const pktm2 = document.getElementById("pktm2").value;
  const lanjutan1 = document.getElementById("lanjutan1").value;
  const lanjutan2 = document.getElementById("lanjutan2").value;
  const jabatan = document.getElementById("jabatan").value;
  const tahunMenjabat = document.getElementById("tahunMenjabat").value;
  const kontak = document.getElementById("kontak").value;
  const alamat = document.getElementById("alamat").value;
  const foto = document.getElementById("foto").files[0];
  const status = document.getElementById("status");

  let fotoUrl = "";

  try {
    if (foto) {
      const storageRef = storage.ref(`foto_kader/${Date.now()}_${foto.name}`);
      await storageRef.put(foto);
      fotoUrl = await storageRef.getDownloadURL();
    }

    const newData = {
      nama,
      angkatan,
      pktm1,
      pktm2,
      lanjutan1,
      lanjutan2,
      jabatan,
      tahunMenjabat,
      kontak,
      alamat,
      fotoUrl
    };

    await db.ref("kader").push(newData);

    status.innerText = "✅ Data berhasil dikirim!";
    this.reset();
  } catch (error) {
    console.error("❌ Gagal menyimpan data:", error);
    status.innerText = "❌ Gagal mengirim data!";
  }
});
