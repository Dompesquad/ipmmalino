// Firebase config
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

const form = document.getElementById("evaluasiForm");
const suksesMsg = document.getElementById("suksesMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    nama: form.nama.value,
    asal: form.asal.value,
    materi: {
      m1: form.m1.value,
      m2: form.m2.value,
      m3: form.m3.value,
      m4: form.m4.value,
      m5: form.m5.value,
      m6: form.m6.value,
      m7: form.m7.value,
      m8: form.m8.value,
      m9: form.m9.value,
      m10: form.m10.value,
      m11: form.m11.value,
      m12: form.m12.value,
      m13: form.m13.value
    }
  };

  db.ref("evaluasi_materi").push(data, function (error) {
    if (error) {
      alert("❌ Gagal mengirim evaluasi!");
    } else {
      suksesMsg.classList.remove("hidden");
      form.reset();
      setTimeout(() => {
        suksesMsg.classList.add("hidden");
      }, 4000);
    }
  });
});
