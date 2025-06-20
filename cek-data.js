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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function cariData() {
  const input = document.getElementById("searchInput").value.toLowerCase().trim();
  const hasil = document.getElementById("hasil");
  const notFound = document.getElementById("notFound");
  hasil.innerHTML = "";
  hasil.classList.add("hidden");
  notFound.classList.add("hidden");

  db.ref("data_kader").once("value", snapshot => {
    let ditemukan = false;
    snapshot.forEach(child => {
      const data = child.val();
      if (
        (data.nama && data.nama.toLowerCase().includes(input)) ||
        (data.hp && data.hp.includes(input))
      ) {
        ditemukan = true;
        hasil.innerHTML = `
          <p><strong>Nama:</strong> ${data.nama}</p>
          <p><strong>Angkatan:</strong> ${data.angkatan}</p>
          <p><strong>PKTM 1:</strong> ${data.tahun_pktm1}</p>
          <p><strong>PKTM 2:</strong> ${data.tahun_pktm2 || "-"}</p>
          <p><strong>Lanjutan 1:</strong> ${data.tingkat_lanjutan1 || "-"}</p>
          <p><strong>Lanjutan 2:</strong> ${data.tingkat_lanjutan2 || "-"}</p>
          <p><strong>Jabatan:</strong> ${data.jabatan || "-"}</p>
          <p><strong>Tahun Menjabat:</strong> ${data.tahun_menjabat || "-"}</p>
          <p><strong>HP / WA:</strong> ${data.hp}</p>
          <p><strong>Alamat:</strong> ${data.alamat}</p>
        `;
      }
    });

    if (ditemukan) {
      hasil.classList.remove("hidden");
    } else {
      notFound.classList.remove("hidden");
    }
  });
}
