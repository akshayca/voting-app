'use strict';
/* global $ */

$(document).ready(function(){

  var url = window.location.href;
  var parts = url.split('=');
  $('h3').text('Polls matching "' + parts[1] + '"');
  $.get('/api/search?q=' + parts[1], function(data) {
    if (data.length === 0) {
      $('#polls').empty();
      $('#polls').append('There are no polls matching your search term. You can <a href="/">view all polls</a> or <a href="/polls/new">create your own</a>.');
    } else {
      populateList(data);
    }
  });

  function populateList(data) {
    $('#polls').empty();
    data.forEach(function(poll) {
      var poll = '<a class="list-group-item" href="/polls/' + poll._id + '">'+ poll.question + '</a>';
      $('#polls').append(poll);
    });
  }
})