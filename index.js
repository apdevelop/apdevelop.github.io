var map = null;
var marker = null;
var view = null;

function loadDemo() {
    createMap();

    getLocation();
    window.setInterval(getLocation, 60000);
}

function getLocation() {
    // TODO: Vue

    if (navigator.geolocation) {
        document.getElementById("status").innerHTML = "Geolocation is supported in your browser.";

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(updateLocation, error, options);
    }
    else {
        document.getElementById("status").innerHTML = "Geolocation is <strong>not</strong> supported in browser.";
    }
}


function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function updateLocation(position) {
    console.log(position);

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    //document.getElementById("status").innerHTML = position; //.coords.latitude + ' ' + position.coords.longitude;

    if (!latitude || !longitude) {
        document.getElementById("status").innerHTML = "Geolocation is supported, but location is not";
        return;
    }

    // TODO: проверка точности и включение индикатора

    var date = new Date(position.timestamp);

    document.getElementById("latitude").innerHTML = latitude;
    document.getElementById("longitude").innerHTML = longitude;
    document.getElementById("accuracy").innerHTML = position.coords.accuracy.toFixed(1);
    document.getElementById("timestamp").innerHTML = position.timestamp;
    document.getElementById("date").innerHTML = date;

    circle.setCenterAndRadius(ol.proj.fromLonLat([longitude, latitude]), position.coords.accuracy);

    view.setCenter(ol.proj.fromLonLat([longitude, latitude]));
    // TODO: по отдельной кнопке view.fit(circle);
}

function createMap() {
    circle = new ol.geom.Circle(ol.proj.fromLonLat([37, 55]), 50000);
    marker = new ol.Feature(circle);


    var vectorLayer0 = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [marker]
        }),
        style: [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                })
            })
        ]
    });

    ////marker = new ol.Feature({
    ////    geometry: new ol.geom.Point(ol.proj.fromLonLat([37.37, 55.55])),
    ////    size: '20'
    ////});

    ////const vectorLayer0 = new ol.layer.Vector({
    ////    title: '0',
    ////    source: new ol.source.Vector({
    ////        features: [marker],
    ////    }),
    ////    style: function (feature) {
    ////        return new ol.style.Style({
    ////            image: new ol.style.Circle({
    ////                radius: 10,
    ////                fill: new ol.style.Fill({ color: '#666666' }),
    ////                stroke: new ol.style.Stroke({ color: '#bada55', width: 1 }),
    ////            }),
    ////        });
    ////    },
    ////});

    view = new ol.View({
        center: ol.proj.fromLonLat([55.09, 37.505]),
        zoom: 6,
    });

    map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults.defaults({
            zoom: true,
            attribution: false,
            rotate: true
        }),
        ////interactions: ol.interaction.defaults({
        ////    dragPan: false
        ////}).extend([new ol.interaction.DragPan()]),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
            vectorLayer0,
            new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: 'https://demo.mapserver.org/cgi-bin/wms',
                    params: { 'LAYERS': 'country_bounds,cities' },
                    ratio: 1,
                    ////serverType: 'mapserver',
                }),
            }),
            ////new ol.layer.Tile({
            ////    source: new ol.source.XYZ({
            ////        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
            ////    }),
            ////}),
        ],
        view: view,
    });

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    document.getElementById("viewportsize").innerHTML = vw + ' x ' + vh;
}

////var map = L.map('map').setView([37.505, 55.09], 10);
////var marker = L.marker([0, 0]).addTo(map);

////L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
////    maxZoom: 19,
////    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
////}).addTo(map);
