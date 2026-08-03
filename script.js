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
                backgroundColor: "rgba(13,110,253,0.15)",
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false,
                tension: 0.35
            },

            {
                label: "Tambak 2",
                data: [],
                borderColor: "#198754",
                backgroundColor: "rgba(25,135,84,0.15)",
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false,
                tension: 0.35
            },

            {
                label: "Tambak 3",
                data: [],
                borderColor: "#dc3545",
                backgroundColor: "rgba(220,53,69,0.15)",
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false,
                tension: 0.35
            }

        ]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        animation: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        plugins: {

            legend: {
                position: "top"
            },

            tooltip: {
                enabled: true
            }

        },

        scales: {

            x: {

                grid: {
                    display: false
                },

                ticks: {
                    maxRotation: 0
                }

            },

            y: {

                beginAtZero: false,

                suggestedMin: 24,

                suggestedMax: 30,

                ticks: {

                    stepSize: 1

                },

                grid: {

                    color: "#e5e5e5"

                }

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

    
    // ==========================
    // Atur skala Y otomatis
    // ==========================
    
    const semuaData = [...suhu1, ...suhu2, ...suhu3];
    
    const minValue = Math.min(...semuaData);
    const maxValue = Math.max(...semuaData);
    
    chart.options.scales.y.min = Math.floor(minValue) - 1;
    chart.options.scales.y.max = Math.ceil(maxValue) + 1;
    chart.options.scales.y.ticks.stepSize = 1;
    
    // ==========================
    
    chart.data.labels = labels;
    
    chart.data.datasets[0].data = suhu1;
    chart.data.datasets[1].data = suhu2;
    chart.data.datasets[2].data = suhu3;
    
    chart.update();

}
