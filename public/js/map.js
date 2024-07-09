mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/outdoors-v12", // style URL
  center: listings.geomatry.coordinates, // starting position
  zoom: 8, // starting zoom
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({ color: "blue" })
  .setLngLat(listings.geomatry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listings.title}</h4> <p>Exact Location Provided after Booking</p>`
    )
  )
  .addTo(map);

// map.addControl(new mapboxgl.FullscreenControl());
