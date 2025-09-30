document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the Map (No change here)
    const batamCoords = [1.0456, 104.0305];
    const map = L.map('map').setView(batamCoords, 5); // Zoom out a bit to see regional events

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const panelContent = document.getElementById('panel-content');
    const loader = document.getElementById('loader');

    // 2. Fetch Data - NEW API ENDPOINT
    // We've replaced the NOAA URL with the USGS real-time earthquake feed.
    const apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

    const fetchData = async () => {
        loader.classList.remove('hidden');
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('USGS data fetched successfully:', data);
            plotDataOnMap(data.features);
        } catch (error) {
            console.error("Could not fetch earthquake data:", error);
            panelContent.innerHTML = `<p style="color: red;">Failed to load data. Please try again later.</p>`;
        } finally {
            loader.classList.add('hidden');
        }
    };

    // 3. Plot Data on the Map - UPDATED FOR NEW DATA
    const plotDataOnMap = (features) => {
        if (!features || features.length === 0) {
            panelContent.innerHTML = `<p>No recent seismic events found.</p>`;
            return;
        }

        const geoJSONLayer = L.geoJSON(features, {
            pointToLayer: (feature, latlng) => {
                // Style points based on earthquake magnitude
                const magnitude = feature.properties.mag;
                return L.circleMarker(latlng, {
                    radius: magnitude * 2.5, // Larger magnitude = bigger circle
                    fillColor: magnitude > 4.5 ? "#f03" : "#ff7800", // Stronger quakes are red
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.7
                });
            },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    updatePanel(feature.properties);
                });
            }
        }).addTo(map);
    };

    // 4. Update the Data Panel - REWRITTEN FOR EARTHQUAKE DATA
    const updatePanel = (props) => {
        // The 'time' property from USGS is a UNIX timestamp. We need to convert it.
        const eventDate = new Date(props.time).toLocaleString('en-GB', {
            dateStyle: 'full',
            timeStyle: 'long',
        });

        panelContent.innerHTML = `
            <div class="data-item">
                <strong>Location:</strong>
                <span>${props.place || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Time:</strong>
                <span>${eventDate || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Magnitude:</strong>
                <span>${props.mag || '0'}</span>
            </div>
            <div class="data-item">
                <strong>Type:</strong>
                <span>${props.type || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Depth:</strong>
                <span>${props.dmin ? props.dmin.toFixed(2) + ' km' : 'N/A'}</span>
            </div>
             <div class="data-item">
                <strong>More Info:</strong>
                <span><a href="${props.url}" target="_blank">View on USGS</a></span>
            </div>
        `;
    };

    // Initial call to fetch data
    fetchData();
});