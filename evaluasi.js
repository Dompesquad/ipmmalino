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

// Elemen
const loginBox = document.getElementById("loginBox");
const adminContent = document.getElementById("adminContent");
const formContent = document.getElementById("formContent");
const loginError = document.getElementById("loginError");
const dataBody = document.getElementById("dataBody");
const formEvaluasi = document.getElementById("formEvaluasi");
const successMsg = document.getElementById("successMsg");

// Periksa URL untuk status admin
const isAdmin = window.location.hash === "#admin";

if (isAdmin) {
  loginBox.classList.remove("hidden");
} else {
  formContent.classList.remove("hidden");
}

// Login Admin
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === "admin" && p === "ipm123") {
    loginBox.classList.add("hidden");
    adminContent.classList.remove("hidden");
    loadData();
  } else {
    loginError.classList.remove("hidden");
  }
}

// Ambil Data Evaluasi
function loadData() {
  db.ref("evaluasi").on("value", snapshot => {
    dataBody.innerHTML = "";
    snapshot.forEach(child => {
      const d = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-2 py-1">${d.nama}</td>
        <td class="border px-2 py-1">${d.kegiatan}</td>
        ${[...Array(13)].map((_, i) => `<td class="border px-2 py-1">${d["m" + (i + 1)] || "-"}</td>`).join("")}
        <td class="border px-2 py-1">${d.fasilitator}</td>
        <td class="border px-2 py-1">${d.panitia}</td>
      `;
      dataBody.appendChild(row);
    });
  });
}

// Kirim Evaluasi Peserta
if (formEvaluasi) {
  formEvaluasi.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(formEvaluasi);
    const data = {};
    formData.forEach((v, k) => data[k] = v);
    db.ref("evaluasi").push(data, () => {
      formEvaluasi.reset();
      successMsg.classList.remove("hidden");
      setTimeout(() => successMsg.classList.add("hidden"), 4000);
    });
  });
}

// Ekspor Excel
function exportToExcel() {
  const table = document.getElementById("evaluasiTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Evaluasi" });
  XLSX.writeFile(wb, "evaluasi_kegiatan.xlsx");
}

// Ekspor PDF
function exportToPDF() {
  const table = document.getElementById("evaluasiTable");
  html2canvas(table).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF('l', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height);
    pdf.save("evaluasi_kegiatan.pdf");
  });
}
