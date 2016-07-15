# Platypus workshop
## 14-07-2016

We're going to make a simple DI dashboard from scratch, using Platypus philosophy and a few lines of code:

### 1. The empty map

First of all, we are going to use the V3 viz.json of an empty map, with only the base skeleton defined. You can find this skeleton in the [viz.js](./workshop/viz.js) file.

### 2. The basic stuff

Create an empty folder and copy there both `scripts` and `themes` folders of this repo. Just delete `/scriptps/myapp.js` because we are going to make our own this time. Create an HTML file called `index.html` and save to your folder.

As already mentioned, we're going host all the JavaScript stuff in a .js file to keep the code clean. Let's create a new file called `myapp.js` and save it to `/scripts` folder. Copy also the mentioned `viz.js` to the same folder.

Reference both .js files in your `index.html` file. This HTML file should look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Platypus workshop</title>
    <meta name=viewport content="width=device-width initial-scale=1">
    <link href="http://cartodb.com/favicon.ico" rel="shortcut icon" />
    <link rel="stylesheet" href="themes/css/deep-insights.css" />
    <link rel="stylesheet" href="themes/css/myapp.css" />
    <script src="scripts/deep-insights.uncompressed.js"></script>
    <script src="scripts/viz.js"></script>
    <script src="scripts/myapp.js"></script>
</head>
<body>

</body>
</html>
```

Now, all your code will be placed in that `myapp.js` file, within an [anonymous function](https://en.wikipedia.org/wiki/Anonymous_function#JavaScript), to limit the scope and enhance the overall performance

```javascript
(function () {

// all your code goes here

})();
```

We may want to add a global object as namespace for all our future needs. You may eventually want to access your stuff from other pieces of your frontend:

```javascript
window.myapp = window.myapp || {};
```

First of all, you need to load CARTO stuff once everything is loaded. There are many ways to achieve this, being the simplest one to use the onload event:

```javascript
 window.onload = function () {

 // ...

}
```

You can use your own viz.json, both as an URL:

```javascript
    var diJSON = 'url to your v3 viz.json',
        username = diJSON.match(/\/u\/(.+)\/api\/v\d\/|:\/\/(.+)\.cartodb\.com\/api/i)[1],
        myapp = window.myapp;
```

Or as object:
```javascript
    var diJSON = {...},
        username = diJSON.datasurce.user_name,
        myapp = window.myapp;
```


I those cases, the username and map name are retrieved from the object, but in this case, we need to set them up and then get the tuned skeleton viz:

```javascript
var myapp = window.myapp,
    username = "Perry_the_platypus",
    mapname = "Airports",
    diJSON = myapp.viz(username, mapname);
```

Remember to change the username to your own CARTO user name!

### 3. Create the dashboard

In your HTML file, let's add a DIV element to the BODY block:

```html
<div class="Dashboard-canvas" id="dashboard"></div>
```
There is where dashboard will be deployed.

Now, we can create the dashboard using the `diJSON` that we defined earlier

```javascript
cartodb.deepInsights.createDashboard('#dashboard', diJSON, {
        no_cdn: false
    }, function (err, dashboard) {

    // This is where magic happens

    });
```

At this point, your dashboard should look like this:

![img](http://pix.toile-libre.org/upload/original/1468490889.png)

### 4. Foundations

Now, within that "magic region", we can add shortcuts to (as of today) hidden objects/methods/events to ease the next steps in the development of the dashboard. Just add these code to the callback function of `createDashboard`:

```javascript
myapp.dashboard = dashboard;

// DI map
myapp.map = dashboard.getMap();

// CDB map to add layers and so
myapp.Cmap = myapp.map.map;

// retrieve the widgets container so we can add a custom one if needed
 myapp.wcontainer = cdb.$('#' + dashboard._dashboard.dashboardView.$el.context.id + ' .CDB-Widget-canvasInner').get(0);

/* function to add widgets
 * The options are described at: https://github.com/CartoDB/deep-insights.js/blob/master/doc/api.md
 * BONUS: "sourceId" option lets you bound a widget to a node instead a of a layer ---> sourceId: mynode.id
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

```

### 5. Analysis nodes

If we want to add widgets to our dashboard... we will need to add nodes!

```javascript
myapp.addNode = function (options) {
    return myapp.map.analysis.analyse(options);
};
```

This time, we are going to go "simple" and add only the source node for our layer

```javascript
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
```

### 6. Layers

Let's add a layer, so we can start playing:

```javascript
myapp.Cmap.createCartoDBLayer({
    "source": 'a0',
    "name": 'Airports',
    "cartocss": '#layer{marker-comp-op:lighten;marker-line-width:0;marker-line-color:#FFF;marker-line-opacity:1;marker-width:10;marker-fill:ramp([elevation_ft],(#5c53a5,#a059a0,#ce6693,#eb7f86,#f8a07e,#fac484,#f3e79b),quantiles);marker-fill-opacity:.8;marker-allow-overlap:true;}'
});
```

![img](http://pix.toile-libre.org/upload/original/1468493815.png)

Now, we can "name" the layers array object to access them later the easy way

```javascript
window.myapp.layers = myapp.map.getLayers();
```

### 7. Widgets

As you saw in \#4, the main functions for widgets are wrapped, so you can focus in your target.

Let's add some widgets to our layer, that has an index value of `1` in the layers array and a node `a0`:

```javascript
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

```

It should looks like

![img](http://pix.toile-libre.org/upload/original/1468496531.png)

### 8. Custom widgets

You need to add the custom widget code to your HTML this way:

```html
<div class="CDB-Widget CDB-Widget--light" id='mywidget'>
    <div class="CDB-Loader"></div>
    <div class="CDB-Widget-error is-hidden">
        <button class="CDB-Widget-button CDB-Widget-errorButton js-refresh"> <span class="CDB-Widget-textSmall CDB-Widget-textSmall--bold">REFRESH</span> </button>
    </div>
    <div class="CDB-Widget-body">
        <div class="CDB-Widget-header js-header">
            <div class="CDB-Widget-title CDB-Widget-contentSpaced">
                <h3 class="CDB-Text CDB-Size-large u-ellipsis js-title">I'm a custom widget</h3>
                <br>
            </div>
        </div>
        <div class="CDB-Widget-content">
            <div class="CDB-Text CDB-Size-medium u-ellipsis">Whatever!</div>
        </div>
    </div>
</div>
```

And then, you can inject it in the dashboard, in the order you like. v.G. : the first in the dashboard.

```javascript
myapp.wcontainer.insertBefore(document.querySelector('#mywidget'), myapp.wcontainer.children[0]);
```

The .js file result should look like this [.js file](./workshop/myapp.js) based on the common template, and the .html should be like [this one](./workshop/index.html).






