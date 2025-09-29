// Inisialisasi peta dan pusatkan di Batam
const map = L.map('map').setView([1.08, 104.03], 11);

// Tambahkan tile layer dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fungsi untuk menentukan warna marker berdasarkan status
function getIconColor(status) {
    if (status === 'Penuh') {
        return 'red';
    } else if (status === 'Sedang') {
        return 'orange';
    } else {
        return 'green';
    }
}

// Ambil data dari backend PHP kita
fetch('api.php')
    .then(response => response.json())
    .then(data => {
        // Loop setiap data lokasi
        data.forEach(lokasi => {
            // Buat ikon kustom
            const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${getIconColor(lokasi.status)}.png`;
            const customIcon = new L.Icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Tambahkan marker ke peta
            const marker = L.marker([lokasi.lat, lokasi.long], { icon: customIcon }).addTo(map);

            // Tambahkan popup (info window) saat marker diklik
            marker.bindPopup(`
                <b>${lokasi.nama}</b><br>
                Status: <strong>${lokasi.status}</strong><br>
                Keterangan: ${lokasi.keterangan}<br>
                <em>Update: ${lokasi.terakhir_update}</em>
            `);
        });
    })
    .catch(error => console.error('Error saat mengambil data:', error));