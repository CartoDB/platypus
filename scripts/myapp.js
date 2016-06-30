(function () {

    window.myapp = window.myapp || {};

    window.onload = function () {

        // the URL to your viz.json
        var diJSON = 'https://team.cartodb.com/u/solutions/api/v3/viz/c008997c-f04e-11e5-bdf9-0ecd1babdde5/viz.json';


        var username = diJSON.match(/\/u\/(.+)\/api\/v\d\/|:\/\/(.+)\.cartodb\.com\/api/i)[1],
            myapp = window.myapp;

        // SQL client, inf needed
        myapp.sqlclient = new cartodb.SQL({
            user: username,
            protocol: "https",
            sql_api_template: "https://{user}.cartodb.com:443"
        });

        myapp.dashboard = cartodb.deepInsights.createDashboard('#dashboard', diJSON, {
            no_cdn: false
        }, function (err, dashboard) {

            // DI map
            myapp.map = dashboard.getMap();

            // Leaflet map object
            myapp.Lmap = myapp.map.getNativeMap();

            // CartoDB layers
            myapp.layers = myapp.map.getLayers();

            // if the layer has an analysis node, its SQL is not exposed in the API
            // WARNING: this will be modified in upcoming iterations
            myapp.layers.map(function (a) {
                var tmp;
                if (a.attributes.sql == void 0) {
                    tmp = dashboard._dashboard.vis._analysisCollection.models.filter(function (b) {
                        return b.id == a.attributes.source;
                    })[0];
                    if (tmp != void 0) {
                        a.attributes.sql = tmp.attributes.query;
                    } else {
                        if (a.attributes.type == 'CartoDB') console.warn('This may be a named map, check the privacy of the map and the datasets involved');
                    }
                }
                return a;
            });

            // Array of widgets views
            myapp.widgets = dashboard.getWidgets();

            // Array of widgets’ data models
            myapp.widgetsdata = myapp.widgets.map(function (a) {
                return a.dataviewModel
            });



            // retrieve the widgets container so we can add a custom one if needed
            myapp.wcontainer = cdb.$('#' + vis.$el.context.id + ' .CDB-Widget-canvasInner').get(0);

            /* function to add widgets
             * The options are described at: https://github.com/CartoDB/deep-insights.js/blob/master/doc/api.md
             */
            myapp.addWidget = function (type, layer_index, options) {
                try {
                    var layer = myapp.layers[layer_index];
                    switch (type) {
                    case 'category':
                        dashboard.createCategoryWidget(options, layer);
                        break;
                    case 'formula':
                        dashboard.createFormulaWidget(options, layer);
                        break;
                    case 'histogram':
                        dashboard.createHistogramWidget(options, layer);
                        break;
                    case 'timeseries':
                        dashboard.createTimeSeriesWidget(options, layer);
                        break;
                    }
                    myapp.widgets = dashboard.getWidgets();
                    myapp.widgetsdata = myapp.widgets.map(function (a) {
                        return a.dataviewModel
                    });
                    return 'OK';
                } catch (error) {
                    return error;
                }
            }

            /* Function to remove widgets based on the index in myapp.widgets array */
            myapp.removeWidget = function (index) {
                myapp.widgets[index].remove();
                myapp.widgets = dashboard.getWidgets();
                myapp.widgetsdata = myapp.widgets.map(function (a) {
                    return a.dataviewModel
                });
            }

            /*
             *
             *       whatever
             *
             */

        });
    }

})();
