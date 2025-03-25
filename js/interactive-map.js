/**
 * Casa Del Sol AZ - Interactive Map
 * Creates a custom styled Google Map with enhanced interactions
 */
function initInteractiveMap() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // Remove existing iframe if present
    const existingIframe = mapContainer.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    // Casa Del Sol address coordinates (18401 W Moreland St, Goodyear, AZ 85338)
    const coordinates = {
        lat: 33.4514456,
        lng: -112.4634664
    };
    
    // Custom map styles - Desert theme
    const mapStyles = [
        {
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#616161"}]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#f5f5f5"}]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [{"color": "#e9e2d3"}]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"color": "#dfd2ae"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#c9bf9f"}]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"color": "#ffffff"}]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{"color": "#d4af37"}]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#c9c9c9"}]
        }
    ];
    
    // Create map element
    const mapElement = document.createElement('div');
    mapElement.id = 'interactive-map';
    mapElement.style.width = '100%';
    mapElement.style.height = '100%';
    mapContainer.appendChild(mapElement);
    
    // Initialize the map
    const map = new google.maps.Map(mapElement, {
        center: coordinates,
        zoom: 15,
        styles: mapStyles,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative'
    });
    
    // Custom marker icon
    const markerIcon = {
        path: 'M12 0C7.31 0 3.07 2.53 3.07 7.11c0 4.59 3.96 7.13 7.19 10.69.38.46.76.94 1.13 1.44l.61.82.61-.82c.37-.5.75-.97 1.13-1.44 3.23-3.55 7.19-6.09 7.19-10.69C21 2.53 16.69 0 12 0zm0 18.3c-.44-.58-.88-1.12-1.32-1.67C7.99 12.85 5.1 10.36 5.1 7.11 5.1 3.65 8.16 2.03 12 2.03c3.84 0 6.9 1.61 6.9 5.08 0 3.24-2.88 5.73-5.68 9.52-.43.55-.87 1.1-1.32 1.67H12z',
        fillColor: '#d4af37',
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 1.5,
        anchor: new google.maps.Point(12, 24),
    };
    
    // Add marker
    const marker = new google.maps.Marker({
        position: coordinates,
        map: map,
        title: 'Casa Del Sol AZ',
        icon: markerIcon,
        animation: google.maps.Animation.DROP
    });
    
    // Create info window content
    const infoContent = `
        <div class="map-info-window">
            <h3>Casa Del Sol AZ</h3>
            <p>18401 W Moreland St<br>Goodyear, AZ 85338</p>
            <a href="https://maps.google.com/maps?daddr=18401+W+Moreland+St,+Goodyear,+AZ+85338" target="_blank" class="directions-link">Get Directions</a>
        </div>
    `;
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 300
    });
    
    // Open info window on marker click
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
    
    // Show info window by default
    infoWindow.open(map, marker);
    
    // Add venue info card overlay
    const venueCard = document.createElement('div');
    venueCard.className = 'venue-info-card';
    venueCard.innerHTML = `
        <h3>Visit Our Venue</h3>
        <div class="venue-address">
            <i class="fas fa-map-marker-alt"></i> 
            18401 W Moreland St, Goodyear, AZ 85338
        </div>
        <div class="venue-phone">
            <i class="fas fa-phone"></i> (480) 123-4567
        </div>
        <a href="contact.html" class="btn btn-secondary">Schedule a Tour</a>
    `;
    
    // Add card to map container
    mapContainer.appendChild(venueCard);
    
    // Add map interactions
    let isDragging = false;
    
    mapContainer.addEventListener('mousedown', () => {
        isDragging = false;
    });
    
    mapContainer.addEventListener('mousemove', () => {
        isDragging = true;
    });
    
    mapContainer.addEventListener('mouseup', (e) => {
        if (!isDragging) {
            // Center the map on marker if clicked but not dragged
            map.setCenter(coordinates);
            map.setZoom(16);
        }
    });
    
    // Add pulse animation to marker
    const markerPulse = document.createElement('div');
    markerPulse.className = 'marker-pulse';
    markerPulse.style.position = 'absolute';
    
    // Make map responsive
    window.addEventListener('resize', function() {
        const center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
    });
}

// Do not include the API key here - it will be added in the HTML file