// Konfigurasi Firebase
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
const tbody = document.querySelector("tbody");

let dataKader = [];
let editId = "";

// Login
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const status = document.getElementById("loginStatus");

  if (u === "admin" && p === "ipm123") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("admin-content").style.display = "block";
    loadData();
  } else {
    status.innerText = "❌ Username atau password salah.";
  }
}
window.login = login;

// Load dan urutkan data
function loadData() {
  db.ref("kader").once("value", snapshot => {
    dataKader = [];
    snapshot.forEach(child => {
      let data = child.val();
      data.id = child.key;
      dataKader.push(data);
    });
    dataKader.sort((a, b) => parseInt(a.angkatan) - parseInt(b.angkatan));
    tampilkanData(1);
  });
}

// Tampilkan data dengan pagination
function tampilkanData(page) {
  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageData = dataKader.slice(start, end);
  tbody.innerHTML = "";

  pageData.forEach(data => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.fotoUrl ? `<img src="${data.fotoUrl}" class="foto-kader" />` : "-"}</td>
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
        <button onclick="editData('${data.id}')">Edit</button>
        <button onclick="hapusData('${data.id}')">Hapus</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Hapus data
function hapusData(id) {
  if (confirm("Yakin ingin menghapus?")) {
    db.ref("kader/" + id).remove().then(loadData);
  }
}

// Tampilkan modal edit
function editData(id) {
  const data = dataKader.find(d => d.id === id);
  if (!data) return;

  editId = id;
  document.getElementById("edit_nama").value = data.nama;
  document.getElementById("edit_angkatan").value = data.angkatan;
  document.getElementById("edit_pktm1").value = data.pktm1;
  document.getElementById("edit_pktm2").value = data.pktm2 || "";
  document.getElementById("edit_lanjutan1").value = data.lanjutan1 || "";
  document.getElementById("edit_lanjutan2").value = data.lanjutan2 || "";
  document.getElementById("edit_jabatan").value = data.jabatan || "";
  document.getElementById("edit_tahunMenjabat").value = data.tahunMenjabat || "";
  document.getElementById("edit_kontak").value = data.kontak;
  document.getElementById("edit_alamat").value = data.alamat;

  document.getElementById("editModal").style.display = "block";
}

// Tutup modal
function tutupModal() {
  document.getElementById("editModal").style.display = "none";
}

// Simpan perubahan
function simpanEdit() {
  const updated = {
    nama: document.getElementById("edit_nama").value.trim(),
    angkatan: document.getElementById("edit_angkatan").value.trim(),
    pktm1: document.getElementById("edit_pktm1").value.trim(),
    pktm2: document.getElementById("edit_pktm2").value.trim(),
    lanjutan1: document.getElementById("edit_lanjutan1").value.trim(),
    lanjutan2: document.getElementById("edit_lanjutan2").value.trim(),
    jabatan: document.getElementById("edit_jabatan").value.trim(),
    tahunMenjabat: document.getElementById("edit_tahunMenjabat").value.trim(),
    kontak: document.getElementById("edit_kontak").value.trim(),
    alamat: document.getElementById("edit_alamat").value.trim()
  };

  db.ref("kader/" + editId).update(updated).then(() => {
    tutupModal();
    loadData();
  });
}

// Export ke Excel
function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dataKader);
  XLSX.utils.book_append_sheet(wb, ws, "Kader IPM");
  XLSX.writeFile(wb, "data-kader-ipm.xlsx");
}

// Export ke PDF
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const perPage = 10;
  const totalPages = Math.ceil(dataKader.length / perPage);

  let y = 40;

  for (let p = 0; p < totalPages; p++) {
    let pageData = dataKader.slice(p * perPage, (p + 1) * perPage);

    pdf.setFontSize(12);
    pdf.text("Data Kader IPM Cabang Malino", 40, y);
    y += 20;

    pageData.forEach((data, i) => {
      pdf.text(`${i + 1 + p * perPage}. ${data.nama} - Angkatan ${data.angkatan}`, 40, y);
      y += 15;
    });

    if (p < totalPages - 1) {
      pdf.addPage();
      y = 40;
    }
  }

  pdf.save("data-kader-ipm.pdf");
}
