function (keys, values, rereduce) {
    var series = [];
    
    if (rereduce) {
      for (var i in values) {
        for (var j in values[i]) {
          series.push(values[i][j]);
        }
      }
    } else {a
      for (var i in values) {
        series.push(values[i]);
      }
    }
    
    return series;
  }