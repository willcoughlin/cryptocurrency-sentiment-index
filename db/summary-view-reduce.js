function (keys, values, rereduce) {
    var max = 0;
    var min = Infinity;
    var sampleSize = 0;
    var sum = 0;
    var sumSq = 0;
    
    if (rereduce) {
      for (var i in values) {
        sampleSize += values[i].sampleSize;
        max = values[i].max > max ? values[i].max : max;
        min = values[i].min < min ? values[i].min : min;
        sum += values[i].sum;
        sumSq += values[i].sumSq;
      }
    } else {
      sampleSize = values.length;
      for (var i in values) {
        max = values[i] > max ? values[i] : max;
        min = values[i] < min ? values[i] : min;
        sum += values[i];
        sumSq += Math.pow(values[i], 2);
      }
    }
    
    var mean = sum / sampleSize;
    
    var variance = (sumSq - Math.pow(sum, 2) / sampleSize) / (sampleSize - 1);
    var stdDev = Math.sqrt(variance);
    
    return {
      "sampleSize": sampleSize,
      "max": max,
      "min": min,
      "sum": sum,
      "sumSq": sumSq,
      "mean" : mean,
      "stdDev": stdDev
    };
  }