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

const loginBox = document.getElementById("loginBox");
const adminContent = document.getElementById("adminContent");
const loginError = document.getElementById("loginError");
const dataBody = document.getElementById("dataBody");

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

function loadData() {
  dataBody.innerHTML = "";
  db.ref("data_pendaftaran").on("value", snapshot => {
    dataBody.innerHTML = "";
    snapshot.forEach(child => {
      const d = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-2 py-1">${d.nama}</td>
        <td class="border px-2 py-1">${d.ttl}</td>
        <td class="border px-2 py-1">${d.asal_sekolah}</td>
        <td class="border px-2 py-1">${d.acara}</td>
        <td class="border px-2 py-1">${d.tujuan}</td>
        <td class="border px-2 py-1">${d.nama_ortu}</td>
        <td class="border px-2 py-1">${d.hp}</td>
      `;
      dataBody.appendChild(row);
    });
  });
}

function exportToExcel() {
  const table = document.getElementById("dataTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Data Pendaftar" });
  XLSX.writeFile(wb, "data_pendaftar_kegiatan.xlsx");
}

function exportToPDF() {
  const table = document.getElementById("dataTable");
  html2canvas(table).then(canvas => {
    const img = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF('l', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, 'PNG', 10, 10, width - 20, height);
    pdf.save("data_pendaftar_kegiatan.pdf");
  });
}
