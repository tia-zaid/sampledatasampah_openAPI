document.addEventListener('DOMContentLoaded', () => {

    // --- Inisialisasi Peta ---
    const batamCoords = [1.0456, 104.0305]; // Koordinat pusat Batam
    const map = L.map('map').setView(batamCoords, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // --- Konfigurasi API dan Data ---
    const apiKey = 'd67903f57ba37ba4c412f341b3461a3a'; 
    const batamCityId = '1650357'; // ID Kota Batam untuk OpenWeatherMap
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${batamCityId}&appid=${apiKey}&units=metric&lang=id`;
    
    // --- Data Simulasi Kondisi Sampah (Ini yang akan diganti jika ada data sensor asli) ---
    const mockWasteData = [
        {
            id: 1,
            lokasi: "Pantai Nongsa",
            lat: 1.1823,
            lng: 104.0935,
            level: "Tinggi", // Bisa "Rendah", "Sedang", "Tinggi"
            keterangan: "Tumpukan sampah plastik dan organik akibat arus laut dari utara.",
            timestamp: new Date().toLocaleString('id-ID')
        },
        {
            id: 2,
            lokasi: "Kawasan Ocarina",
            lat: 1.1351,
            lng: 104.0392,
            level: "Sedang",
            keterangan: "Sampah didominasi oleh botol minum dan kemasan makanan.",
            timestamp: new Date().toLocaleString('id-ID')
        },
        {
            id: 3,
            lokasi: "Pesisir Jembatan Barelang",
            lat: 0.9845,
            lng: 104.0101,
            level: "Rendah",
            keterangan: "Kondisi relatif bersih, hanya sedikit sampah ringan.",
            timestamp: new Date().toLocaleString('id-ID')
        }
    ];

    // --- Fungsi untuk Mengambil Data Cuaca ---
    async function fetchWeatherData() {
        try {
            const response = await fetch(weatherApiUrl);
            const data = await response.json();

            // Update panel informasi cuaca
            document.getElementById('location').textContent = data.name;
            document.getElementById('weather-desc').textContent = data.weather[0].description;
            document.getElementById('temp').textContent = data.main.temp;
            document.getElementById('wind-speed').textContent = data.wind.speed;

        } catch (error) {
            console.error("Gagal mengambil data cuaca:", error);
            document.getElementById('weather-info').innerHTML = "<p>Gagal memuat data cuaca.</p>";
        }
    }

    // --- Fungsi untuk Menampilkan Data Sampah di Peta ---
    function displayWasteData() {
        mockWasteData.forEach(data => {
            let markerColor = 'green'; // Default untuk 'Rendah'
            if (data.level === 'Sedang') markerColor = 'orange';
            if (data.level === 'Tinggi') markerColor = 'red';

            const marker = L.marker([data.lat, data.lng], {
                icon: L.divIcon({
                    className: 'leaflet-div-icon',
                    html: `<span style="background-color: ${markerColor}; width: 20px; height: 20px; display: block; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></span>`
                })
            }).addTo(map);

            // Tampilkan info saat marker diklik
            marker.on('click', () => {
                const detailsPanel = document.getElementById('location-details');
                detailsPanel.innerHTML = `
                    <h3>${data.lokasi}</h3>
                    <p><strong>Tingkat Volume Sampah:</strong> <span style="color: ${markerColor}; font-weight: bold;">${data.level}</span></p>
                    <p><strong>Keterangan:</strong> ${data.keterangan}</p>
                    <p><strong>Update Terakhir:</strong> ${data.timestamp}</p>
                `;
            });
        });
    }

    // --- Panggil Fungsi Saat Halaman Dimuat ---
    fetchWeatherData();
    displayWasteData();

    // Refresh data cuaca setiap 10 menit
    setInterval(fetchWeatherData, 600000); 
});