document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the Map
    // Coordinates for Batam, Indonesia
    const batamCoords = [1.0456, 104.0305];
    const map = L.map('map').setView(batamCoords, 10); // Center map on Batam, zoom level 10

    // Add a tile layer from OpenStreetMap (free to use)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Get references to DOM elements
    const panelContent = document.getElementById('panel-content');
    const loader = document.getElementById('loader');

    // 2. Fetch Waste Data
    // We'll use the NOAA Marine Debris Monitoring and Assessment Project (MDMAP) dataset.
    // We define a bounding box around the Riau Islands to filter the global data.
    const boundingBox = {
        minLat: 0.5,
        maxLat: 1.5,
        minLon: 103.5,
        maxLon: 104.5
    };
    
    // Construct the API URL. This API returns data in GeoJSON format.
    const apiUrl = `https://services2.arcgis.com/C8EMgrsFcR2i0Y6r/arcgis/rest/services/MDMAP_Results/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=${boundingBox.minLon},${boundingBox.minLat},${boundingBox.maxLon},${boundingBox.maxLat}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&f=geojson`;

    const fetchData = async () => {
        loader.classList.remove('hidden'); // Show loader
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Data fetched successfully:', data); // Log data to console for inspection
            plotDataOnMap(data.features);
        } catch (error) {
            console.error("Could not fetch waste data:", error);
            panelContent.innerHTML = `<p style="color: red;">Failed to load data. Please try again later.</p>`;
        } finally {
            loader.classList.add('hidden'); // Hide loader
        }
    };

    // 3. Plot Data on the Map
    const plotDataOnMap = (features) => {
        if (!features || features.length === 0) {
            panelContent.innerHTML = `<p>No waste data found for the Batam region in the selected dataset.</p>`;
            return;
        }

        const wasteLayer = L.geoJSON(features, {
            pointToLayer: (feature, latlng) => {
                // Style the markers
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: (feature, layer) => {
                // Add a click event to each marker
                layer.on('click', () => {
                    updatePanel(feature.properties);
                });
            }
        }).addTo(map);

        // Adjust map view to fit all markers
        if (wasteLayer.getBounds().isValid()) {
            map.fitBounds(wasteLayer.getBounds());
        }
    };

    // 4. Update the Data Panel with Details
    const updatePanel = (props) => {
        // Format date for readability
        const eventDate = new Date(props.Date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        panelContent.innerHTML = `
            <div class="data-item">
                <strong>Location:</strong>
                <span>${props.Location || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Date Recorded:</strong>
                <span>${eventDate || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Total Items Collected:</strong>
                <span>${props.Total_Items || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Material Type (Most Common):</strong>
                <span>${props.Material || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Waste Category:</strong>
                <span>${props.Category || 'N/A'}</span>
            </div>
            <div class="data-item">
                <strong>Source Organization:</strong>
                <span>${props.Organization || 'N/A'}</span>
            </div>
        `;
    };

    // Initial call to fetch data when the script loads
    fetchData();
});