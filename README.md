# pre DI template

Full template to make DI dashboards easily with public maps/datasets.

Named maps need a diferent piping and are not this straightforward.

Check the [tiny workshop](./workshop.md) for further info.

# Tips:

* For simplicity and elegance sake: **DO NOT CODE JavaScript OR CSS WITHIN THE HTML** (unless it is a matter of death and live). Use .js and .css files instead. You will find samples here to start with. Please forget everything about `<script>` and `<style>` tags.

* window.vis == myapp.map

* Add widgets to layer #1, using the options described [here](https://github.com/CartoDB/deep-insights.js/blob/master/doc/api.md)
```javascript
myapp.addWidget('category', 1, {
    "source": {"id":'a0'},
  "title": "Metro line",
  "column": "closest_metro_line",
  "aggregation": "count"
})
```

* Add a custom widget(`mywidget`) in position 0 of the widgets container like:

```javascript
myapp.wcontainer.insertBefore(document.querySelector('#mywidget'), myapp.wcontainer.children[0]);
```

where the widget is defined in the HTML like

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

It will be visible only if there is at least one native widget present

* Add new layers like:

```javascript
vis.map.createCartoDBLayer({
        "source": 'a0',
      "type": "CartoDB",
      "cartocss": "#populated_places{marker-fill-opacity: 0.9;marker-line-width: 0;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-width: 2;marker-fill: #FFFFFF;marker-allow-overlap: true;}",
      "sql": "select * from populated_places"
    });
```

* Get/Set the query or the styling of the layer #1 like:

```javascript
var mysql = myapp.layers[1].get('sql');

myapp.layers[2].set('cartocss', '#spain_census2011{
  polygon-fill: #FF6600;
  polygon-opacity: 0.7;
  line-color: #FFF;
  line-width: 0.5;
  line-opacity: 1;
}')
```

* Get/set the available params for a given widget (view / model):

```javascript
// get
myapp.widgets[1].get('attrsNames')
myapp.widgetsdata[1].constructor.ATTRS_NAMES

// set
myapp.widgets[1].update({"prefix":" meters"})
myapp.widgetsdata[1].update({"bins": 25})
```

* Get the available events for a given widget (view / model):

```javascript
Object.keys(myapp.widgets[1]._events)
Object.keys(myapp.widgetsdata[1]._events)
```

* Get/Set the selected bins of a given histogram/time-series widget

```javascript
// get
myapp.widgetsdata[4].filter.get('min')
myapp.widgetsdata[4].filter.get('max')

// set
myapp.widgetsdata[4].filter.setRange(min_val,max_val)
```

* Get/Set the selected categories of a given category widget

```javascript
// get
myapp.widgetsdata[4].filter.acceptedCategories.toJSON().map(function(a){return a.name})

// set
myapp.widgetsdata[4].filter.accept(["Arts", "Education and Society"]);
```

* In category widgets, the aggregation column param should be `aggregation_column` instead of `aggregationColumn` to work.
