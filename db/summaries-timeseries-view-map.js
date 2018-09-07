function (doc) {
    emit(doc.symbol, { date: doc.date, mean: doc.summary.mean });
  }