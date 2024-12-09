const map = new maplibregl.Map({
    container: "map",
    style:
        "https://api.maptiler.com/maps/streets-v2/style.json?key=dcHa7n5Kd3SQoKxfYgCF",
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 12,
});
const marker = new maplibregl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);

const popup = new maplibregl.Popup({ offset: 25})
    .setLngLat(listing.geometry.coordinates)
    .setHTML(`<h4>${listing.title}</h4><p>Exact loation provided after booking</p>`)
    .setMaxWidth("300px")
    .addTo(map);