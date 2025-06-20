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

// UI Elements
const loginBox = document.getElementById("loginBox");
const adminContent = document.getElementById("adminContent");
const loginError = document.getElementById("loginError");
const dataBody = document.getElementById("dataBody");

// Login Admin
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

// Ambil dan tampilkan data kader
function loadData() {
  dataBody.innerHTML = "";
  db.ref("data_kader").on("value", snapshot => {
    dataBody.innerHTML = "";
    snapshot.forEach(child => {
      const d = child.val();
      const key = child.key;
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
        <td class="border px-2 py-1">
          <button onclick="editRow('${key}')" class="text-blue-600">Edit</button> |
          <button onclick="deleteRow('${key}')" class="text-red-600">Hapus</button>
        </td>
      `;
      dataBody.appendChild(row);
    });
  });
}

// Edit data kader
function editRow(key) {
  db.ref("data_kader/" + key).once("value").then(snapshot => {
    const d = snapshot.val();
    const updated = {
      nama: prompt("Nama Lengkap:", d.nama) || d.nama,
      angkatan: prompt("Angkatan:", d.angkatan) || d.angkatan,
      tahun_pktm1: prompt("PKTM 1:", d.tahun_pktm1) || d.tahun_pktm1,
      tahun_pktm2: prompt("PKTM 2:", d.tahun_pktm2) || d.tahun_pktm2,
      tingkat_lanjutan1: prompt("Tingkat Lanjutan 1:", d.tingkat_lanjutan1) || d.tingkat_lanjutan1,
      tingkat_lanjutan2: prompt("Tingkat Lanjutan 2:", d.tingkat_lanjutan2) || d.tingkat_lanjutan2,
      jabatan: prompt("Jabatan:", d.jabatan) || d.jabatan,
      hp: prompt("No HP/WA:", d.hp) || d.hp,
      alamat: prompt("Alamat:", d.alamat) || d.alamat
    };
    db.ref("data_kader/" + key).update(updated);
  });
}

// Hapus data kader
function deleteRow(key) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    db.ref("data_kader/" + key).remove();
  }
}

// Export Excel
function exportToExcel() {
  const table = document.getElementById("dataTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Data Kader" });
  XLSX.writeFile(wb, "data_kader_ipm.xlsx");
}

// Export PDF
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

// Backup ke JSON
function backupToJSON() {
  db.ref("data_kader").once("value").then(snapshot => {
    const data = snapshot.val();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "data_kader_ipm.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
