// Firebase Config (pastikan cocok dengan app.js)
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
const tbody = document.querySelector("tbody");

// Login Manual
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("loginStatus");

  if (username === "admin" && password === "ipm123") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("admin-content").style.display = "block";
    status.innerText = "";
    loadData();
  } else {
    status.innerText = "❌ Username atau password salah.";
  }
}

// Ambil dan tampilkan data kader
function loadData() {
  database.ref("kader").once("value", (snapshot) => {
    const dataList = [];

    snapshot.forEach((child) => {
      const data = child.val();
      data.id = child.key;
      dataList.push(data);
    });

    // Urutkan berdasarkan angkatan (numerik)
    dataList.sort((a, b) => parseInt(a.angkatan) - parseInt(b.angkatan));

    // Tampilkan data ke tabel
    tbody.innerHTML = "";
    dataList.forEach((data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          ${data.fotoUrl ? `<img src="${data.fotoUrl}" class="foto-kader" />` : "-"}
        </td>
        <td>${data.nama}</td>
        <td>${data.angkatan}</td>
        <td>${data.pktm1}</td>
        <td>${data.pktm2 || ""}</td>
        <td>${data.lanjutan1 || ""}</td>
        <td>${data.lanjutan2 || ""}</td>
        <td>${data.jabatan || ""}</td>
        <td>${data.tahunMenjabat || ""}</td>
        <td>${data.kontak}</td>
        <td>${data.alamat}</td>
        <td>
          <button onclick="hapusData('${data.id}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  });
}

// Fungsi hapus data
function hapusData(id) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    database.ref("kader").child(id).remove().then(() => {
      loadData();
    });
  }
}
