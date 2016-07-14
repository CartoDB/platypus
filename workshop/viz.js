(function () {

    var makeUUID = function () {
        var d = Date.now(),
            uuid = 'PLATYPUS-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var s = (window.crypto) ? window.crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000 : Math.random();
                r = (d + s * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        return uuid;
    };

    window.myapp = window.myapp || {};

    window.myapp.viz = function(user, name){
        var viz={
            "id": makeUUID(),
            "version": "3.0.0",
            "title": name,
            "likes": 0,
            "description": null,
            "scrollwheel": false,
            "legends": false,
            "map_provider": "leaflet",
            "bounds": [
                [-74.35482803013983, -181.40625],
                [74.35482803013984, 181.23046875]
            ],
            "center": "[0, -0.087890625]",
            "zoom": 3,
            "updated_at": new Date().toISOString(),
            "layers": [{
                "options": {
                    "default": "true",
                    "url": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                    "subdomains": "abcd",
                    "minZoom": "0",
                    "maxZoom": "18",
                    "name": "Positron",
                    "className": "positron_rainbow_labels",
                    "attribution": "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"http://carto.com/attributions\">CARTO</a>",
                    "labels": {
                        "url": "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
                    },
                    "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                },
                "infowindow": null,
                "tooltip": null,
                "id": makeUUID(),
                "order": 0,
                "type": "tiled"
            }, {
                "type": "layergroup",
                "options": {
                    "user_name": user,
                    "maps_api_template": "https://{user}.carto.com:443",
                    "sql_api_template": "https://{user}.carto.com:443",
                    "filter": "mapnik",
                    "layer_definition": {
                        "stat_tag": makeUUID(),
                        "version": "3.0.0",
                        "layers": []
                    },
                    "attribution": ""
                }
            }, {
                "options": {
                    "default": "true",
                    "url": "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
                    "subdomains": "abcd",
                    "minZoom": "0",
                    "maxZoom": "18",
                    "attribution": "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"http://carto.com/attributions\">CARTO</a>",
                    "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
                    "type": "Tiled",
                    "name": "Positron Labels"
                },
                "infowindow": null,
                "tooltip": null,
                "id": makeUUID(),
                "order": 2,
                "type": "tiled"
            }],
            "overlays": [{
                "type": "share",
                "order": 2,
                "options": {
                    "display": true,
                    "x": 20,
                    "y": 20
                },
                "template": ""
            }, {
                "type": "search",
                "order": 3,
                "options": {
                    "display": true,
                    "x": 60,
                    "y": 20
                },
                "template": ""
            }, {
                "type": "zoom",
                "order": 6,
                "options": {
                    "display": true,
                    "x": 20,
                    "y": 20
                },
                "template": "<a href=\"#zoom_in\" class=\"zoom_in\">+</a> <a href=\"#zoom_out\" class=\"zoom_out\">-</a>"
            }, {
                "type": "loader",
                "order": 8,
                "options": {
                    "display": true,
                    "x": 20,
                    "y": 150
                },
                "template": "<div class=\"loader\" original-title=\"\"></div>"
            }, {
                "type": "logo",
                "order": 9,
                "options": {
                    "display": true,
                    "x": 10,
                    "y": 40
                },
                "template": ""
            }],
            "prev": null,
            "next": null,
            "transition_options": {
                "time": 0
            },
            "widgets": [],
            "datasource": {
                "user_name": user,
                "maps_api_template": "https://{user}.carto.com:443",
                "stat_tag": makeUUID()
            },
            "user": {
                "fullname": user,
                "avatar_url": "https://s3.amazonaws.com/com.cartodb.users-assets.production/production/cartofante/assets/20160711085940nYDKmRx1.jpg",
                "profile_url": ""
            },
            "analyses": [],
            "vector": false
        };
        return viz;
    }

})();
