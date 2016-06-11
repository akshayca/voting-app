'use strict';
/* global $ */

$(document).ready(function(){
  $.get('/api/polls', populateList);

  function populateList(data) {
    data.forEach(function(poll) {
      var poll = '<a class="list-group-item" href="/polls/' + poll._id + '">'+ poll.question + '</a>';
      $('#polls').append(poll);
    });
  }
})