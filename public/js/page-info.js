/* global $ */
$(document).ready(function() {
  
  var pollId = 2;
  var pollData;
  
  $.get('data1.json', populatePage)
  
  function populatePage(pollData) {
    $('#pollCreator').text(pollData.creator); 
    $('#pollQuestion').text(pollData.question);
    var responses = pollData.responses
    var keys = Object.keys(responses);
    var tableContents = '<tr><th>Response</th><th>Votes</th></tr>';
    keys.forEach(function(key) {
      var votes = responses[key];
      tableContents += '<tr><td>' + key + '</td><td>' + votes + '</td></tr>';
    });
    $('table').html(tableContents);
  }
});
