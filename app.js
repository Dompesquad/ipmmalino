// Konfigurasi Firebase (pastikan cocok dengan project Firebase kamu)
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
const database = firebase.database();
const storage = firebase.storage();

document.getElementById("kaderForm").addEventListener("submit", function(e) {
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
  const fotoFile = document.getElementById("foto").files[0];

  const status = document.getElementById("status");
  status.innerText = "Menyimpan data...";

  if (fotoFile) {
    // Upload foto ke Firebase Storage
    const storageRef = storage.ref('fotos/' + Date.now() + "_" + fotoFile.name);
    storageRef.put(fotoFile).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((url) => {
        simpanData(url);
      });
    }).catch((error) => {
      status.innerText = "Gagal mengunggah foto.";
    });
  } else {
    // Tanpa foto
    simpanData("");
  }

  function simpanData(fotoUrl) {
    const data = {
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
      fotoUrl,
      waktu: new Date().toISOString()
    };

    database.ref("kader").push(data, () => {
      document.getElementById("kaderForm").reset();
      status.innerText = "✅ Data berhasil dikirim!";
    });
  }
});
