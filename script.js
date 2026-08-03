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
                borderColor: "#0d6efd",
                backgroundColor: "#0d6efd",
                tension: 0.3,
                borderWidth: 3
            },

            {
                label: "Tambak 2",
                data: [],
                borderColor: "#198754",
                backgroundColor: "#198754",
                tension: 0.3,
                borderWidth: 3
            },

            {
                label: "Tambak 3",
                data: [],
                borderColor: "#dc3545",
                backgroundColor: "#dc3545",
                tension: 0.3,
                borderWidth: 3
            }

        ]

    },

    options:{

    responsive:true,

    maintainAspectRatio:false,

    animation:false,

    scales:{
        y:{
            min:20,
            max:35
        }
    }
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

function tampilkanHistory(data)
{
    const tbody = document.getElementById("historyBody");

    tbody.innerHTML = "";

    const labels = [];
    const suhu1 = [];
    const suhu2 = [];
    const suhu3 = [];

    const jumlah = data.jumlahSample;

    for(let i = 1; i <= jumlah; i++)
    {
        const sample = data["sample" + i];

        labels.push(sample.waktu);

        suhu1.push(sample.suhu1);
        suhu2.push(sample.suhu2);
        suhu3.push(sample.suhu3);

        tbody.innerHTML += `
        <tr>
            <td>${sample.waktu}</td>
            <td>${sample.suhu1.toFixed(2)} °C</td>
            <td>${sample.suhu2.toFixed(2)} °C</td>
            <td>${sample.suhu3.toFixed(2)} °C</td>
        </tr>
        `;
    }

    chart.data.labels = labels;

    chart.data.datasets[0].data = suhu1;
    chart.data.datasets[1].data = suhu2;
    chart.data.datasets[2].data = suhu3;

    chart.update();

}
