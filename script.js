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
let chart;

const ctx = document.getElementById("historyChart");

chart = new Chart(ctx, {

    type: "line",

    data: {

        labels: [],

        datasets: [

            {

                label: "Tambak 1",

                data: [],

                borderWidth: 2

            },

            {

                label: "Tambak 2",

                data: [],

                borderWidth: 2

            },

            {

                label: "Tambak 3",

                data: [],

                borderWidth: 2

            }

        ]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false

    }

});

const historyRef = ref(database, "monitoring/history");

onValue(historyRef, (snapshot) => {

    const history = snapshot.val();

    if (!history) return;

    // Ambil tanggal terbaru
    const tanggalList = Object.keys(history).sort();

    const tanggalTerbaru = tanggalList[tanggalList.length - 1];

    // Ambil seluruh sesi pada tanggal tersebut
    const sesi = history[tanggalTerbaru];

    // Ambil jam terbaru
    const jamList = Object.keys(sesi).sort();

    const jamTerbaru = jamList[jamList.length - 1];

    // Ambil data sesi terbaru
    const data = sesi[jamTerbaru];

    tampilkanHistory(data);

});

function tampilkanHistory(data){

    const tbody = document.getElementById("historyBody");

    tbody.innerHTML = "";

    const jumlah = data.jumlahSample;

    for(let i = 1; i <= jumlah; i++){

        const sample = data["sample" + i];

        const row = `
        <tr>

            <td>${sample.waktu}</td>

            <td>${sample.suhu1.toFixed(2)} °C</td>

            <td>${sample.suhu2.toFixed(2)} °C</td>

            <td>${sample.suhu3.toFixed(2)} °C</td>

        </tr>
        `;

        tbody.innerHTML += row;

    }

}
