document.addEventListener('DOMContentLoaded', function () {
    // 1. Inisialisasi Peta
    const map = L.map('map').setView([1.04, 104.04], 10);

    // 2. Tambahkan Basemaps (Peta Dasar)
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const baseMaps = {
        "OpenStreetMap": osmLayer,
        "Citra Satelit": satelliteLayer
    };

    // 3. Muat dan Tampilkan Data Laporan Sampah (debris.geojson)
    const debrisMarkers = L.markerClusterGroup();

    fetch('debris.geojson')
       .then(response => response.json())
       .then(data => {
            const geoJsonLayer = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    const props = feature.properties;
                    let popupContent = `
                        <h4>${props.debrisType}</h4>
                        <p>${props.description |

| 'Tidak ada deskripsi.'}</p>
                        <small>Dilaporkan pada: ${new Date(props.timestamp).toLocaleString()}</small>
                    `;
                    if (props.imageUrl) {
                        popupContent += `<br><br><img src="${props.imageUrl}" alt="Foto Sampah" style="width:100%; max-width:200px;">`;
                    }
                    layer.bindPopup(popupContent);
                }
            });
            debrisMarkers.addLayer(geoJsonLayer);
            map.addLayer(debrisMarkers);
        })
       .catch(error => console.error('Error memuat data GeoJSON:', error));

    // 4. Muat dan Tampilkan Data Arus Laut (currents.json)
    let currentsLayer;
    fetch('currents.json') // File ini harus dihasilkan oleh backend (misal: AWS Lambda)
       .then(response => response.json())
       .then(data => {
            currentsLayer = L.velocityLayer({
                displayValues: true,
                displayOptions: {
                    velocityType: 'Arus Laut',
                    position: 'bottomleft',
                    emptyString: 'Tidak ada data arus',
                    angleConvention: 'bearing',
                    speedUnit: 'm/s'
                },
                data: data,
                maxVelocity: 1.0, // Sesuaikan berdasarkan data Anda
                velocityScale: 0.1 // Sesuaikan untuk visualisasi yang lebih baik
            });
        })
       .catch(error => console.error('Error memuat data arus:', error));

    // 5. Tambahkan Kontrol Lapisan (Layer Control)
    const overlayMaps = {
        "Laporan Sampah": debrisMarkers,
        "Arus Laut": currentsLayer // Akan ditambahkan setelah fetch selesai
    };
    
    // Menunggu data arus dimuat sebelum menambahkan ke kontrol
    setTimeout(() => {
        if (currentsLayer) {
            overlayMaps["Arus Laut"] = currentsLayer;
        }
        L.control.layers(baseMaps, overlayMaps).addTo(map);
    }, 2000); // Penundaan sederhana untuk memastikan fetch selesai

    // 6. Logika untuk Modal Formulir Pelaporan
    const modal = document.getElementById('reportModal');
    const reportBtn = document.getElementById('reportBtn');
    const closeBtn = document.getElementsByClassName('close-button');
    const form = document.getElementById('reportForm');
    let reportLocation = null;

    reportBtn.onclick = function() {
        modal.style.display = 'block';
        map.getContainer().style.cursor = 'crosshair';
        map.once('click', function(e) {
            reportLocation = e.latlng;
            document.getElementById('latitude').value = reportLocation.lat;
            document.getElementById('longitude').value = reportLocation.lng;
            map.getContainer().style.cursor = '';
            alert(`Lokasi dipilih: ${reportLocation.lat.toFixed(4)}, ${reportLocation.lng.toFixed(4)}`);
        });
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
        map.getContainer().style.cursor = '';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            map.getContainer().style.cursor = '';
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!reportLocation) {
            alert('Silakan pilih lokasi di peta terlebih dahulu!');
            return;
        }

        const formData = new FormData(form);
        const submissionData = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [reportLocation.lng, reportLocation.lat]
            },
            properties: {
                debrisType: formData.get('debrisType'),
                description: formData.get('description'),
                timestamp: new Date().toISOString(),
                status: "Dilaporkan"
                // Logika untuk imageUrl perlu penanganan backend
            }
        };

        console.log("Data yang akan dikirim ke backend:", JSON.stringify(submissionData, null, 2));
        
        // --- SIMULASI PENGIRIMAN KE BACKEND ---
        // Di aplikasi nyata, di sini Anda akan menggunakan fetch() untuk mengirim
        // permintaan POST ke endpoint API Gateway Anda.
        // fetch('URL_API_GATEWAY_ANDA', {
        //     method: 'POST',
        //     body: JSON.stringify(submissionData)
        // })
        //.then(response => response.json())
        //.then(data => {
        //     alert('Laporan berhasil dikirim!');
        //     location.reload(); // Muat ulang halaman untuk melihat data baru
        // })
        //.catch(error => console.error('Error:', error));

        alert('Laporan disimulasikan untuk dikirim. Cek console log untuk melihat datanya.');
        modal.style.display = 'none';
        reportLocation = null;
        form.reset();
    });
});