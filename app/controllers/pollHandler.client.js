'use strict';
/* global $ */

$(document).ready(function() {
  
  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);
  $.get('/api/polls/' + id, populatePage);

  function populatePage(pollData) {
    console.log(pollData);
    $('#pollCreator').text(pollData.creator); 
    $('#pollQuestion').text(pollData.question);
    var responses = pollData.responses
    var tableContents = '<tr><th>Response</th><th>Votes</th></tr>';
    responses.forEach(function(response) {
      tableContents += '<tr><td>' + response.response + '</td><td>' + response.votes + '</td></tr>';
    });
    $('table').html(tableContents);
  }
  
  $('#add').click(function(e) {
    e.preventDefault();
    console.log("Clicked add! Sending req")
    $.post('/api/polls', function(data){
      console.log(data);
    })
  })
});  