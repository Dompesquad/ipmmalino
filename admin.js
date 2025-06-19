// Firebase config (sama dengan index)
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

const loginForm = document.getElementById("loginForm");
const adminPanel = document.getElementById("adminPanel");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const u = username.value.trim();
  const p = password.value.trim();
  if (u === "admin" && p === "ipm123") {
    loginForm.style.display = "none";
    adminPanel.style.display = "block";
    loadData();
  } else {
    alert("Login gagal. Username atau password salah.");
  }
});

let allData = [];
let currentPage = 1;
const perPage = 10;

function loadData() {
  db.ref("kader").once("value", (snapshot) => {
    const data = [];
    snapshot.forEach((child) => {
      data.push({ key: child.key, ...child.val() });
    });

    // Sort by angkatan ascending
    data.sort((a, b) => Number(a.angkatan) - Number(b.angkatan));
    allData = data;
    showPage(1);
    createPagination();
  });
}

function showPage(page) {
  currentPage = page;
  const tbody = document.getElementById("kaderBody");
  tbody.innerHTML = "";
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const dataPage = allData.slice(start, end);

  dataPage.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.angkatan}</td>
      <td>${item.wa}</td>
      <td>${item.fotoUrl ? `<img src="${item.fotoUrl}" class="foto-preview"/>` : '-'}</td>
      <td>
        <button onclick="editData('${item.key}')">✏️</button>
        <button onclick="deleteData('${item.key}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function createPagination() {
  const totalPages = Math.ceil(allData.length / perPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === currentPage) ? "active" : "";
    btn.onclick = () => showPage(i);
    pagination.appendChild(btn);
  }
}

function deleteData(key) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    db.ref("kader/" + key).remove().then(() => loadData());
  }
}

function editData(key) {
  const item = allData.find(d => d.key === key);
  const newNama = prompt("Edit nama:", item.nama);
  const newAngkatan = prompt("Edit angkatan:", item.angkatan);
  if (newNama && newAngkatan) {
    db.ref("kader/" + key).update({ nama: newNama, angkatan: newAngkatan }).then(() => loadData());
  }
}

function exportToExcel() {
  let csv = "Nama,Angkatan,PKTM1,PKTM2,Tingkat Lanjutan 1,Tingkat Lanjutan 2,Jabatan,Tahun,WA,Alamat\n";
  allData.forEach(d => {
    csv += `${d.nama},${d.angkatan},${d.pktm1||''},${d.pktm2||''},${d.lanjutan1||''},${d.lanjutan2||''},${d.jabatan||''},${d.tahunJabat||''},${d.wa},${d.alamat}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data-kader-ipm.csv";
  a.click();
}
