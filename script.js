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

    const status1 = getStatusSuhu(data.suhu1);
    const status2 = getStatusSuhu(data.suhu2);
    const status3 = getStatusSuhu(data.suhu3);
    
    document.getElementById("status1").innerHTML = status1.status;
    document.getElementById("status2").innerHTML = status2.status;
    document.getElementById("status3").innerHTML = status3.status;
    
    document.getElementById("status1").style.color = status1.warna;
    document.getElementById("status2").style.color = status2.warna;
    document.getElementById("status3").style.color = status3.warna;

    // Tambahkan bagian ini
    document.getElementById("tooltip1").innerHTML =
    "<b>" + status1.status + "</b><br><br>" + status1.deskripsi;
    
    document.getElementById("tooltip2").innerHTML =
    "<b>" + status2.status + "</b><br><br>" + status2.deskripsi;
    
    document.getElementById("tooltip3").innerHTML =
    "<b>" + status3.status + "</b><br><br>" + status3.deskripsi;

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

let semuaHistory = {};

onValue(historyRef, (snapshot) => {

    semuaHistory = snapshot.val();

    if(!semuaHistory) return;

    buatTabTanggal();

});


function getStatusSuhu(suhu){

    if(suhu < 25){

        return {
            status: "🔵 Suhu Rendah",
            warna: "#0d6efd",
            deskripsi:`
            <b>Dampak</b><br>
            • Nafsu makan menurun.<br>
            • Metabolisme melambat.<br>
            • Pertumbuhan kurang optimal.<br>
            • Ikan lebih rentan terhadap penyakit.<br><br>
        
            <b>Rekomendasi</b><br>
            Pantau suhu dan hindari penurunan suhu yang terlalu drastis.
            `
        };

    }
    else if(suhu <= 30){

        return {
            status: "🟢 Optimal",
            warna: "#198754",
            deskripsi:`
            <b>Dampak</b><br>
            • Nafsu makan optimal.<br>
            • Metabolisme normal.<br>
            • Pertumbuhan maksimal.<br>
            • Kondisi tambak ideal.<br><br>
        
            <b>Rekomendasi</b><br>
            Pertahankan kondisi tambak seperti saat ini.
            `
        };

    }
    else if(suhu <= 32){

        return {
            status: "🟡 Waspada",
            warna: "#ffc107",
            deskripsi:`
            <b>Dampak</b><br>
            • Suhu mulai melebihi kisaran ideal.<br>
            • Oksigen terlarut mulai menurun.<br>
            • Ikan masih dapat tumbuh dengan baik.<br><br>
        
            <b>Rekomendasi</b><br>
            Pantau suhu secara berkala dan pastikan aerasi bekerja dengan baik.
            `

            
        };

    }
    else if(suhu <= 35){

        return {
            status: "🟠 Siaga",
            warna: "#fd7e14",
            deskripsi:`
            <b>Dampak</b><br>
            • Metabolisme meningkat.<br>
            • Ikan mulai mengalami stres.<br>
            • Nafsu makan menurun.<br><br>
        
            <b>Rekomendasi</b><br>
            Tingkatkan aerasi dan lakukan sirkulasi air bila memungkinkan.
            `
        };

    }
    else{

        return {
            status: "🔴 Bahaya",
            warna: "#dc3545",
            deskripsi:`
            <b>Dampak</b><br>
            • Suhu sangat tinggi.<br>
            • Risiko stres berat meningkat.<br>
            • Pertumbuhan terganggu.<br>
            • Risiko kematian ikan meningkat.<br><br>
        
            <b>Rekomendasi</b><br>
            Segera turunkan suhu air atau lakukan pergantian air.
            `
        };

    }

    

}

function buatTabTanggal(){

    const container = document.getElementById("tanggalTabs");

    container.innerHTML = "";

    const tanggalList = Object.keys(semuaHistory).sort().reverse();

    tanggalList.forEach((tanggal,index)=>{

        const tab = document.createElement("div");

        tab.className = "tanggal-tab";

        if(index===0){

            tab.classList.add("active-tab");

        }

        const teks = new Date(tanggal)
            .toLocaleDateString("id-ID",{

                day:"2-digit",

                month:"short"

            });

        tab.innerHTML = teks;

        tab.onclick=()=>{

            document.querySelectorAll(".tanggal-tab")
            .forEach(x=>x.classList.remove("active-tab"));

            tab.classList.add("active-tab");

            tampilkanHari(tanggal);

        };

        container.appendChild(tab);

    });

    tampilkanHari(tanggalList[0]);

}

function tampilkanHari(tanggal){

    const semuaJam = semuaHistory[tanggal];

    buatTabJam(semuaJam);

    buatTabelHari(semuaJam);

    updateGrafikHari(semuaJam);

}

function buatTabJam(semuaJam){

    const container = document.getElementById("jamTabs");

    container.innerHTML = "";

    const jamList = Object.keys(semuaJam).sort();

    jamList.forEach((jam,index)=>{

        const tab = document.createElement("div");

        tab.className = "jam-tab";

        if(index===0){

            tab.classList.add("active-tab");

        }

        tab.innerHTML = jam.substring(0,5).replace("-",":");

        tab.onclick=()=>{

            document.querySelectorAll(".jam-tab")
            .forEach(x=>x.classList.remove("active-tab"));

            tab.classList.add("active-tab");

            const tujuan = document.getElementById("jam-"+jam);

            if(tujuan){

                tujuan.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }

        };

        container.appendChild(tab);

    });

}

function buatTabelHari(semuaJam){

    const tbody = document.getElementById("historyBody");

    tbody.innerHTML = "";

    const jamList = Object.keys(semuaJam).sort();

    jamList.forEach(jam=>{

        tbody.innerHTML += `
        <tr id="jam-${jam}">
            <td colspan="4"
                style="
                background:#0d6efd;
                color:white;
                font-weight:bold;
                text-align:left;">
                Monitoring ${jam.substring(0,5).replace("-",":")}
            </td>
        </tr>
        `;

        const data = semuaJam[jam];

        for(let i=1;i<=data.jumlahSample;i++){

            const sample=data["sample"+i];

            tbody.innerHTML += `
            <tr>

                <td>${sample.waktu}</td>

                <td>${sample.suhu1.toFixed(2)} °C</td>

                <td>${sample.suhu2.toFixed(2)} °C</td>

                <td>${sample.suhu3.toFixed(2)} °C</td>

            </tr>
            `;

        }

    });

}

function updateGrafikHari(semuaJam){

    const labels = [];
    const suhu1 = [];
    const suhu2 = [];
    const suhu3 = [];

    const jamList = Object.keys(semuaJam).sort();

    jamList.forEach(jam=>{

        const data = semuaJam[jam];

        let total1 = 0;
        let total2 = 0;
        let total3 = 0;

        for(let i=1;i<=data.jumlahSample;i++){

            total1 += data["sample"+i].suhu1;
            total2 += data["sample"+i].suhu2;
            total3 += data["sample"+i].suhu3;

        }

        labels.push(jam.substring(0,5).replace("-",":"));

        suhu1.push(total1/data.jumlahSample);
        suhu2.push(total2/data.jumlahSample);
        suhu3.push(total3/data.jumlahSample);

    });

    const semuaData = [...suhu1,...suhu2,...suhu3];

    chart.options.scales.y.min =
        Math.floor(Math.min(...semuaData)/2)*2;

    chart.options.scales.y.max =
        Math.ceil(Math.max(...semuaData)/2)*2;

    chart.options.scales.y.ticks.stepSize = 1;

    chart.data.labels = labels;
    chart.data.datasets[0].data = suhu1;
    chart.data.datasets[1].data = suhu2;
    chart.data.datasets[2].data = suhu3;

    chart.update();

}
   
