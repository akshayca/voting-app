'use strict';
/* global $ */

$(document).ready(function(){

  $.get('/api/polls', function(polls) {
    $('#polls').empty();
    polls.forEach(function(poll) {
      $.get('/api/allvotes/' + poll._id, function(votes) {
        var listing = '<a class="list-group-item" href="/polls/' + poll._id + '"><span class="badge">' + votes.count + '</span>' + poll.question + '</a>';
        $('#polls').append(listing);
      });
    });
  });


});
