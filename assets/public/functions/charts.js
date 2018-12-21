(function() {
  var charts, loaded;
  charts = [];
  loaded = false;
  $(window).load(function() {
    var args, func, _i, _len, _ref, _results;
    loaded = true;
    _results = [];
    for (_i = 0, _len = charts.length; _i < _len; _i++) {
      _ref = charts[_i], func = _ref[0], args = _ref[1];
      _results.push(func.apply(null, args));
    }
    return _results;
  });
  window.$charts = {
    date: function(elem, data, opts) {
      var chart, count, cumulative, d, date, i, n, step, _len;
      if (!loaded) {
        return charts.push([$charts.date, arguments]);
      }
      d = new google.visualization.DataTable();
      d.addColumn('date', 'Date');
      d.addColumn('number', 'Count');
      n = 0;
      date = data.shift();
      step = data.shift();
      cumulative = data.shift();
      for (i = 0, _len = data.length; i < _len; i++) {
        count = data[i];
        if (!cumulative) {
          n = 0;
        }
        d.addRow([new Date(date.getTime() + i * step * 1000), n += count]);
      }
      chart = new google.visualization.LineChart(document.getElementById(elem));
      //chart = new Dygraph.GVizChart(document.getElementById(elem));
      return chart.draw(d, opts);
    },
    pie: function(elem, data, opts) {
      var chart, d;
      if (!loaded) {
        return charts.push([$charts.pie, arguments]);
      }
      d = new google.visualization.DataTable();
      d.addColumn('string');
      d.addColumn('number');
      d.addRows(data);
      chart = new google.visualization.PieChart(document.getElementById(elem));
      return chart.draw(d, opts);
    },
    bar: function(elem, data, opts) {
      var chart, d;
      if (!loaded) {
        return charts.push([$charts.bar, arguments]);
      }
      d = new google.visualization.DataTable();
      d.addColumn('string', 'User');
      d.addColumn('number', 'Screenshots');
      d.addColumn('number', 'Torrents');
      d.addRows(data);
      chart = new google.visualization.BarChart(document.getElementById(elem));
      return chart.draw(d, opts);
    }
  };
}).call(this);
