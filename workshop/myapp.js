(function () {

    window.myapp = window.myapp || {};

    window.onload = function () {

        var myapp = window.myapp,
            username = "abel",
            mapname = "Airports",
            diJSON = myapp.viz(username, mapname);

        cartodb.deepInsights.createDashboard('#dashboard', diJSON, {
            no_cdn: false
        }, function (err, dashboard) {

            myapp.dashboard = dashboard;

            myapp.map = dashboard.getMap();

            myapp.Cmap = myapp.map.map;

            myapp.wcontainer = cdb.$('#' + dashboard._dashboard.dashboardView.$el.context.id + ' .CDB-Widget-canvasInner').get(0);

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

           myapp.removeWidget = function (index) {
                myapp.widgets[index].remove();
                myapp.widgets = dashboard.getWidgets();
                myapp.widgetsdata = myapp.widgets.map(function (a) {
                    return a.dataviewModel
                });
            }

            myapp.addNode = function (options) {
                return myapp.map.analysis.analyse(options);
            }

            myapp.addNode({
                "id": "a0",
                "type": "source",
                "params": {
                    "query": "SELECT * FROM abel.airports"
                },
                "options": {
                    "table_name": "abel.airports"
                }
            });

            myapp.Cmap.createCartoDBLayer({
                "source": 'a0',
                "name": 'Airports',
                "type": "CartoDB",
                "sql": 'SELECT * FROM abel.airports',
                "cartocss": '#layer{marker-comp-op:lighten;marker-line-width:0;marker-line-color:#FFF;marker-line-opacity:1;marker-width:10;marker-fill:ramp([elevation_ft],(#5c53a5,#a059a0,#ce6693,#eb7f86,#f8a07e,#fac484,#f3e79b),quantiles);marker-fill-opacity:.8;marker-allow-overlap:true;}'
            });

            window.myapp.layers = myapp.map.getLayers();

            myapp.addWidget('formula',1, {
                "source": {"id":'a0'},
                "column":'cartodb_id',
                "title":'Total airports',
                "operation":'count'
            });
            myapp.addWidget('category',1, {
                "source": {"id":'a0'},
                "column":'iso_country',
                "title":'Country',
                "operation":'count'
            });
            myapp.addWidget('category',1, {
                "source": {"id":'a0'},
                "column":'type',
                "title":'Type',
                "operation":'count'
            });
            myapp.addWidget('histogram',1, {
                "source": {"id":'a0'},
                "column":'elevation_ft',
                "title":'Elevation',
                "bins":'25'
            });

            myapp.wcontainer.insertBefore(document.querySelector('#mywidget'), myapp.wcontainer.children[0]);

        });
    }

})();
