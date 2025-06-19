firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const tbody = document.querySelector("tbody");

function loadData() {
  db.ref("kader").once("value", (snapshot) => {
    tbody.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
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
          <button onclick="hapusData('${child.key}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  });
}

function hapusData(id) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    db.ref("kader").child(id).remove(() => {
      loadData();
    });
  }
}

function exportToExcel() {
  window.print(); // bisa ganti dengan lib seperti SheetJS kalau mau
}

function exportToPDF() {
  window.print(); // bisa ganti dengan jspdf lib
}

loadData();
