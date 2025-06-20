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

// Buat Header Materi Dinamis
const evalHeader = document.getElementById("evalHeader");
evalHeader.innerHTML = `
  <tr>
    <th class="border px-2 py-1">Nama</th>
    <th class="border px-2 py-1">Kegiatan</th>
    ${[...Array(13)].map((_, i) => `<th class="border px-2 py-1">M${i + 1}</th>`).join("")}
    <th class="border px-2 py-1">Fasilitator</th>
    <th class="border px-2 py-1">Panitia</th>
    <th class="border px-2 py-1">Saran</th>
  </tr>
`;

// Ambil data dari Firebase
const evalBody = document.getElementById("evalBody");
db.ref("evaluasi_kegiatan").on("value", snapshot => {
  evalBody.innerHTML = "";
  snapshot.forEach(child => {
    const d = child.val();
    const materi = [...Array(13)].map((_, i) => `<td class="border px-2 py-1">${d["materi" + (i + 1)] || ""}</td>`).join("");
    const row = `
      <tr>
        <td class="border px-2 py-1">${d.nama}</td>
        <td class="border px-2 py-1">${d.kegiatan}</td>
        ${materi}
        <td class="border px-2 py-1">${d.fasilitator}</td>
        <td class="border px-2 py-1">${d.panitia}</td>
        <td class="border px-2 py-1">${d.saran}</td>
      </tr>
    `;
    evalBody.innerHTML += row;
  });
});

// Export Excel
function exportToExcel() {
  const table = document.getElementById("evalTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Evaluasi" });
  XLSX.writeFile(wb, "hasil_evaluasi.xlsx");
}

// Export PDF
function exportToPDF() {
  const table = document.getElementById("evalTable");
  html2canvas(table).then(canvas => {
    const img = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF('l', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, 'PNG', 10, 10, width - 20, height);
    pdf.save("hasil_evaluasi.pdf");
  });
}
