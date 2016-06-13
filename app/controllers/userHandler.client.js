'use strict';
/* global $ */

$(document).ready(function() {

  $.get('/api/currentuser/' + profileUser, function(result) {
    console.log(result);
    if (result.isCurrentUser === "true") {
      $("li.poll").append('<button class="deletePoll btn btn-danger">Delete</button>');
    };
  });
});
