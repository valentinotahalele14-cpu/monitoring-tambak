import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {

    apiKey: "AIzaSyDokCp6TjDwGu04S7wXVzgo8Lff72J0zLU",

    authDomain: "monitoring-tambak-dc95b.firebaseapp.com",

    databaseURL: "https://monitoring-tambak-dc95b-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "monitoring-tambak-dc95b",

    storageBucket: "monitoring-tambak-dc95b.firebasestorage.app",

    messagingSenderId: "805038715829",

    appId: "1:805038715829:web:6b664131b4c2feb5ed1ffc"

};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database };
