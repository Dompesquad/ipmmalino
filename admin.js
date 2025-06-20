// Firebase
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

// Element
const loginBox = document.getElementById("loginBox");
const adminContent = document.getElementById("adminContent");
const loginError = document.getElementById("loginError");
const dataBody = document.getElementById("dataBody");
const searchInput = document.getElementById("searchInput");

let dataList = [];

// Login manual
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "ipm123") {
    loginBox.classList.add("hidden");
    adminContent.classList.remove("hidden");
    loadData();
  } else {
    loginError.classList.remove("hidden");
  }
}

// Load data
function loadData() {
  db.ref("data_kader").on("value", snapshot => {
    dataList = [];
    snapshot.forEach(child => {
      dataList.push({ key: child.key, ...child.val() });
    });
    renderTable(dataList);
  });
}

// Tampilkan tabel
function renderTable(data) {
  dataBody.innerHTML = "";
  data.forEach(d => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-2 py-1">${d.nama}</td>
      <td class="border px-2 py-1">${d.angkatan}</td>
      <td class="border px-2 py-1">${d.tahun_pktm1}</td>
      <td class="border px-2 py-1">${d.tahun_pktm2 || ''}</td>
      <td class="border px-2 py-1">${(d.tingkat_lanjutan1 || '') + ' ' + (d.tingkat_lanjutan2 || '')}</td>
      <td class="border px-2 py-1">${d.jabatan || ''}</td>
      <td class="border px-2 py-1">${d.hp}</td>
      <td class="border px-2 py-1">${d.alamat}</td>
      <td class="border px-2 py-1 text-center">
        <button onclick="editRow('${d.key}')" class="text-blue-600">Edit</button> |
        <button onclick="deleteRow('${d.key}')" class="text-red-600">Hapus</button>
      </td>`;
    dataBody.appendChild(row);
  });
}

// Edit
function editRow(key) {
  const d = dataList.find(i => i.key === key);
  if (!d) return;

  const updated = {
    nama: prompt("Nama:", d.nama) || d.nama,
    angkatan: prompt("Angkatan:", d.angkatan) || d.angkatan,
    tahun_pktm1: prompt("PKTM 1:", d.tahun_pktm1) || d.tahun_pktm1,
    tahun_pktm2: prompt("PKTM 2:", d.tahun_pktm2) || d.tahun_pktm2,
    tingkat_lanjutan1: prompt("Lanjutan 1:", d.tingkat_lanjutan1) || d.tingkat_lanjutan1,
    tingkat_lanjutan2: prompt("Lanjutan 2:", d.tingkat_lanjutan2) || d.tingkat_lanjutan2,
    jabatan: prompt("Jabatan:", d.jabatan) || d.jabatan,
    hp: prompt("HP:", d.hp) || d.hp,
    alamat: prompt("Alamat:", d.alamat) || d.alamat
  };

  db.ref("data_kader/" + key).update(updated);
}

// Delete
function deleteRow(key) {
  if (confirm("Yakin hapus data ini?")) {
    db.ref("data_kader/" + key).remove();
  }
}

// Search
function searchData() {
  const query = searchInput.value.toLowerCase();
  const filtered = dataList.filter(d =>
    d.nama.toLowerCase().includes(query) ||
    d.angkatan.toLowerCase().includes(query) ||
    d.tahun_pktm1.toLowerCase().includes(query)
  );
  renderTable(filtered);
}

// Export
function exportToExcel() {
  const table = document.getElementById("dataTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Data Kader" });
  XLSX.writeFile(wb, "data_kader_ipm.xlsx");
}

function exportToPDF() {
  const table = document.getElementById("dataTable");
  html2canvas(table).then(canvas => {
    const img = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF('l', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, 'PNG', 10, 10, width - 20, height);
    pdf.save("data_kader_ipm.pdf");
  });
}
