import {

    database

} from "./firebase.js";

import {

    ref,

    onValue

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const realtimeRef = ref(database, "monitoring/realtime");

onValue(realtimeRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    document.getElementById("status").innerHTML =
        "🟢 Online";

    document.getElementById("update").innerHTML =
        data.tanggal + "<br>" + data.jam;

    document.getElementById("suhu1").innerHTML =
        data.suhu1.toFixed(2) + " °C";

    document.getElementById("suhu2").innerHTML =
        data.suhu2.toFixed(2) + " °C";

    document.getElementById("suhu3").innerHTML =
        data.suhu3.toFixed(2) + " °C";

});
