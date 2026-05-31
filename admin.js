import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJKLFq0ChkRUtf0AFrFY7GL4AdL_BpUyA",
  authDomain: "pilotron-text-live.firebaseapp.com",
  projectId: "pilotron-text-live",
  storageBucket: "pilotron-text-live.firebasestorage.app",
  messagingSenderId: "315875806360",
  appId: "1:315875806360:web:6d25f30c6f8c7f9cb094ed",
  measurementId: "G-DHVPM23K5G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ADMIN_PASSWORD = "pilotron2026";

const loginBtn = document.getElementById("login");
const passwordInput = document.getElementById("password");
const loginBox = document.getElementById("login-box");
const panel = document.getElementById("panel");
const messagesDiv = document.getElementById("messages");
const logoutArea = document.getElementById("logout-area");
const btnOn = document.getElementById("btn-on");
const btnOff = document.getElementById("btn-off");
const counterTitle = document.getElementById("counter-title");

if (localStorage.getItem("vj_logged_in") === "true") {
  bukaPanelUtama();
}

loginBtn.addEventListener("click", () => {
  if (passwordInput.value !== ADMIN_PASSWORD) {
    alert("Password salah ketua!");
    return;
  }
  localStorage.setItem("vj_logged_in", "true");
  bukaPanelUtama();
});

function bukaPanelUtama() {
  loginBox.style.display = "none";
  panel.style.display = "block";
  
  logoutArea.innerHTML = `<button id="logout-btn">LOGOUT</button>`;
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("vj_logged_in");
    window.location.reload();
  });

  // Sinkronisasi lampu tombol aktif dari Firebase
  onSnapshot(doc(db, "settings", "gate"), (docSnap) => {
    let statusSekarang = true;
    if (docSnap.exists()) {
      statusSekarang = docSnap.data().isOpen;
    }
    
    if (statusSekarang) {
      btnOn.classList.add("active");
      btnOff.classList.remove("active");
    } else {
      btnOff.classList.add("active");
      btnOn.classList.remove("active");
    }
  });

  // Tombol ON diklik
  btnOn.addEventListener("click", async () => {
    await setDoc(doc(db, "settings", "gate"), { isOpen: true });
  });

  // Tombol OFF diklik
  btnOff.addEventListener("click", async () => {
    await setDoc(doc(db, "settings", "gate"), { isOpen: false });
  });

  // Tarik data antrean real-time
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    let nomor = 1;
    const totalPesan = snapshot.size;

    counterTitle.innerText = `Antrean Pesan Live (${totalPesan}/7)`;

    snapshot.forEach((snapshotDoc) => {
      const data = snapshotDoc.data();
      const textMessage = data.text;
      const docId = snapshotDoc.id;

      const div = document.createElement("div");
      div.style.cssText = `
        background: linear-gradient(135deg, #13131a 0%, #1c1c24 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-left: 4px solid #00adb5;
        padding: 18px;
        border-radius: 14px;
        text-align: center;
        box-shadow: 0 8px 20px rgba(0,0,0,0.4);
      `;

      div.innerHTML = `
        <div style="font-size: 11px; color: #00adb5; font-weight: 600; letter-spacing: 1px; margin-bottom: 10px;">
          ANTREAN NO. ${nomor}
        </div>
        <div style="font-size: 18px; font-weight: 700; white-space: pre-line; color: #ffffff; margin-bottom: 18px; line-height: 1.4;">
          ${textMessage}
        </div>
        
        <div style="display: flex; gap: 12px; max-width: 320px; margin: 0 auto;">
          <button class="btn-copy" style="background:#ffcc00; color:#000; border:none; padding:10px; font-size:13px; font-weight:bold; border-radius:8px; cursor:pointer; flex:2;">COPY</button>
          <button class="btn-delete" style="background:rgba(255,59,48,0.15); color:#ff3b30; border:1px solid rgba(255,59,48,0.3); padding:10px; font-size:13px; font-weight:bold; border-radius:8px; cursor:pointer; flex:1;">HAPUS</button>
        </div>
      `;

      const copyBtn = div.querySelector(".btn-copy");
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(textMessage).then(() => {
          copyBtn.innerText = "COPIED! ✓";
          copyBtn.style.background = "#28a745";
          copyBtn.style.color = "#fff";
          setTimeout(() => {
            copyBtn.innerText = "COPY";
            copyBtn.style.background = "#ffcc00";
            copyBtn.style.color = "#000";
          }, 1000);
        });
      });

      div.querySelector(".btn-delete").addEventListener("click", async () => {
        if (confirm("Hapus pesan ini dari antrean, ketua?")) {
          await deleteDoc(doc(db, "messages", docId));
        }
      });

      messagesDiv.appendChild(div);
      nomor++;
    });
  });
}