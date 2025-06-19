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

let stats = {};

db.ref("data_kader").once("value").then(snapshot => {
  const data = [];
  snapshot.forEach(child => data.push(child.val()));
  renderCharts(data);
});

function renderCharts(data) {
  const angkatanMap = {};
  let withPKTM2 = 0, withoutPKTM2 = 0;
  let adaLanjutan = 0, tidakAda = 0;
  const tahunMap = {};

  data.forEach(d => {
    const a = d.angkatan || "Tidak Diisi";
    angkatanMap[a] = (angkatanMap[a] || 0) + 1;

    if (d.tahun_pktm2 && d.tahun_pktm2.trim() !== "") withPKTM2++;
    else withoutPKTM2++;

    if ((d.tingkat_lanjutan1 || "").trim() !== "" || (d.tingkat_lanjutan2 || "").trim() !== "")
      adaLanjutan++;
    else tidakAda++;

    const tahun = d.tahun_menjabat || "Tidak Diisi";
    tahunMap[tahun] = (tahunMap[tahun] || 0) + 1;
  });

  const angkatanLabels = Object.keys(angkatanMap).sort((a, b) => parseInt(a) - parseInt(b));
  const angkatanCounts = angkatanLabels.map(a => angkatanMap[a]);
  const tahunLabels = Object.keys(tahunMap).sort();
  const tahunCounts = tahunLabels.map(t => tahunMap[t]);

  stats = { angkatanLabels, angkatanCounts, withPKTM2, withoutPKTM2, adaLanjutan, tidakAda, tahunLabels, tahunCounts };

  new Chart(document.getElementById("angkatanChart"), {
    type: "bar",
    data: {
      labels: angkatanLabels,
      datasets: [{ label: "Jumlah Kader", data: angkatanCounts, backgroundColor: "#facc15" }]
    }
  });

  new Chart(document.getElementById("pktm2Chart"), {
    type: "pie",
    data: {
      labels: ["Ya", "Tidak"],
      datasets: [{ data: [withPKTM2, withoutPKTM2], backgroundColor: ["#22c55e", "#ef4444"] }]
    }
  });

  new Chart(document.getElementById("lanjutanChart"), {
    type: "doughnut",
    data: {
      labels: ["Ada", "Tidak Ada"],
      datasets: [{ data: [adaLanjutan, tidakAda], backgroundColor: ["#0ea5e9", "#e5e7eb"] }]
    }
  });

  new Chart(document.getElementById("menjabatChart"), {
    type: "bar",
    data: {
      labels: tahunLabels,
      datasets: [{ label: "Jumlah", data: tahunCounts, backgroundColor: "#a855f7" }]
    }
  });
}

// Export semua chart ke PDF
function exportAllChartsToPDF() {
  const container = document.getElementById("chartContainer");
  html2canvas(container).then(canvas => {
    const img = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = canvas.height * width / canvas.width;
    pdf.addImage(img, "PNG", 10, 10, width - 20, height);
    pdf.save("statistik_kader_ipm.pdf");
  });
}

// Export statistik ke Excel
function exportStatsToExcel() {
  const wb = XLSX.utils.book_new();

  const sheetAngkatan = XLSX.utils.aoa_to_sheet([
    ["Angkatan", "Jumlah"],
    ...stats.angkatanLabels.map((label, i) => [label, stats.angkatanCounts[i]])
  ]);
  XLSX.utils.book_append_sheet(wb, sheetAngkatan, "Angkatan");

  const sheetPKTM = XLSX.utils.aoa_to_sheet([
    ["Status", "Jumlah"],
    ["Ya", stats.withPKTM2],
    ["Tidak", stats.withoutPKTM2]
  ]);
  XLSX.utils.book_append_sheet(wb, sheetPKTM, "PKTM 2");

  const sheetLanjutan = XLSX.utils.aoa_to_sheet([
    ["Status", "Jumlah"],
    ["Ada", stats.adaLanjutan],
    ["Tidak Ada", stats.tidakAda]
  ]);
  XLSX.utils.book_append_sheet(wb, sheetLanjutan, "Tingkat Lanjutan");

  const sheetJabatan = XLSX.utils.aoa_to_sheet([
    ["Tahun Menjabat", "Jumlah"],
    ...stats.tahunLabels.map((label, i) => [label, stats.tahunCounts[i]])
  ]);
  XLSX.utils.book_append_sheet(wb, sheetJabatan, "Tahun Menjabat");

  XLSX.writeFile(wb, "statistik_kader_ipm.xlsx");
}
