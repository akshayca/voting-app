'use strict';
/* global $ */

$(document).ready(function() {

  $.get('/api/currentuser/' + profileUser, function(result) {
    console.log(result);
    if (result.isCurrentUser === "true") {
      $("li.poll").append('<button class="deletePoll btn btn-danger" id="delete">Delete</button>');
    };
  });

  $('li').on('click', 'button', deletePoll);

});

function deletePoll(e) {
  e.preventDefault();
  if ($(e.target).text() === "Delete") {
    var targetPollParent = $(e.target).parent();
    var targetPoll = targetPollParent.find('a');
    var targetPollId = targetPoll.attr('id');
    var targetPollQuestion = targetPoll.text();
    var go = confirm('Are you sure you want to delete the poll "' + targetPollQuestion + '"?');
    if (go === true) {
      $.get('/api/polls/' + targetPollId + '/delete', function(result) {
        if (result === "unauthorized") {
          alert("You are not authorized to delete this poll");
        } else {
          targetPollParent.remove();
        }
      });
    }
  }
}