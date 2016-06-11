/* global $ */

function fetchChartData(id, path, callback, callback2, callback3) {
  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);
  $.get('/api/polls/' + id, function(data) {
    transformData(data, callback2, callback3)
  });
}

function transformData(data, callback, callback2){
  console.log(data);
  var keys = [];
  var values = [];
  var responses = data["responses"];
  function compare(a,b) {
    if  {
      return -1;
    } else if (a.votes > b.votes) {
      return 1;
    } else { 
      return 0;
    }
  }

  sortedResponses = responses.sort(compare);

  console.log("sorted responses: " + sortedResponses);
  sortedResponses.forEach(function(response) {
    keys.push(response.response);
    values.push(response.votes);
  });
  
  //limit them to 10 entries + 'all other' summary
  if (keys.length > 10) {
    var legendKeys = keys.splice(0,10);
    legendKeys.push('All other responses');
  
    var legendValues = values.splice(0,10);
    var sumLowEnd = values.reduce(function(sum, cv) {
      return sum + cv;
    })
    legendValues.push(sumLowEnd);
    
    keys = legendKeys;
    values = legendValues;
  }

  
   //callback
  if (callback){
    callback(keys, values, callback2)
  }
}
  
function readyDataStructures(keys, values, callback) {
   //generate 11 color palette
  var colors = palette('cb-Spectral', 11);
  colors = colors.map(function(color){
    return '#' + color;
  });

  //chart.js's data model
  var data = {
    labels: keys,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }
    ]
  };

  //chart.js's options model
  var options = {
    cutoutPercentage: 70
  };
  
  //Callback
  if(callback) {
    callback(data, options);
  }
}

function buildChart(data, options) {

  var ctx = document.getElementById("pollChart").getContext("2d");

  return new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  })
}


var pollId = 2;
var mychart = fetchChartData(pollId, './data1.json', transformData, readyDataStructures, buildChart);

