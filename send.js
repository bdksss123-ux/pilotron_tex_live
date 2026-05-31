import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc
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

const nama = document.getElementById("nama");
const pesan = document.getElementById("pesan");
const kirim = document.getElementById("kirim");
const status = document.getElementById("status");

kirim.addEventListener("click", async () => {

const isiPesan = pesan.value.trim();

if(!isiPesan){
status.innerText = "Pesan kosong!";
return;
}

const namaPengirim = nama.value.trim();

let hasilPesan = isiPesan;

if(namaPengirim !== ""){
hasilPesan = isiPesan + "\n\n#" + namaPengirim;
}

try{

await addDoc(
collection(db,"messages"),
{
text: hasilPesan,
createdAt: Date.now()
}
);

status.innerText = "Pesan terkirim!";

nama.value = "";
pesan.value = "";

}catch(error){

status.innerText = "Gagal mengirim pesan";

console.log(error);

}

});