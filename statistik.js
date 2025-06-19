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

// Ambil data
db.ref("data_kader").once("value").then(snapshot => {
  const data = [];
  snapshot.forEach(child => data.push(child.val()));

  renderCharts(data);
});

function renderCharts(data) {
  // 1. Angkatan
  const angkatanMap = {};
  data.forEach(d => {
    const a = d.angkatan || "Tidak Diisi";
    angkatanMap[a] = (angkatanMap[a] || 0) + 1;
  });
  const angkatanLabels = Object.keys(angkatanMap).sort((a, b) => parseInt(a) - parseInt(b));
  const angkatanCounts = angkatanLabels.map(a => angkatanMap[a]);

  // 2. PKTM 2
  let withPKTM2 = 0, withoutPKTM2 = 0;
  data.forEach(d => {
    if (d.tahun_pktm2 && d.tahun_pktm2.trim() !== "") {
      withPKTM2++;
    } else {
      withoutPKTM2++;
    }
  });

  // 3. Tingkat Lanjutan
  let adaLanjutan = 0, tidakAda = 0;
  data.forEach(d => {
    if ((d.tingkat_lanjutan1 || "").trim() !== "" || (d.tingkat_lanjutan2 || "").trim() !== "") {
      adaLanjutan++;
    } else {
      tidakAda++;
    }
  });

  // 4. Tahun Menjabat
  const tahunMap = {};
  data.forEach(d => {
    const tahun = d.tahun_menjabat || "Tidak Diisi";
    tahunMap[tahun] = (tahunMap[tahun] || 0) + 1;
  });
  const tahunLabels = Object.keys(tahunMap).sort();
  const tahunCounts = tahunLabels.map(t => tahunMap[t]);

  // Render chart
  new Chart(document.getElementById("angkatanChart"), {
    type: "bar",
    data: {
      labels: angkatanLabels,
      datasets: [{
        label: "Jumlah Kader",
        data: angkatanCounts,
        backgroundColor: "#facc15"
      }]
    }
  });

  new Chart(document.getElementById("pktm2Chart"), {
    type: "pie",
    data: {
      labels: ["Ya", "Tidak"],
      datasets: [{
        data: [withPKTM2, withoutPKTM2],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });

  new Chart(document.getElementById("lanjutanChart"), {
    type: "doughnut",
    data: {
      labels: ["Ada", "Tidak Ada"],
      datasets: [{
        data: [adaLanjutan, tidakAda],
        backgroundColor: ["#0ea5e9", "#e5e7eb"]
      }]
    }
  });

  new Chart(document.getElementById("menjabatChart"), {
    type: "bar",
    data: {
      labels: tahunLabels,
      datasets: [{
        label: "Jumlah",
        data: tahunCounts,
        backgroundColor: "#a855f7"
      }]
    }
  });
}
