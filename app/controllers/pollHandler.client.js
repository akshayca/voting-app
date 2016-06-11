'use strict';
/* global $ */

$(document).ready(function() {

  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);

  $.get('/api/votes', function(voteList) {
    console.log(voteList);
    if (voteList.indexOf(id) !== -1) {
      loadPollResults(id);
    } else {
      loadPoll(id);
    }
  });

  function loadPoll(id) {
    $.get('/api/polls/' + id, populatePage);

    function populatePage(pollData) {
      console.log(pollData.question);
      $('#question').text(pollData.question);
      $.get('/api/polls/' + id + '/options', function(optionsData) {
        console.log(optionsData);
        optionsData.forEach(function(option) {
          $('#options').append('<a class="list-group-item votable-option" href="/api/polls/' + pollData._id + '/options/' + option._id + '">' + option.text + '</a>');
        });
      });
    }
  }

  function loadPollResults(id) {
    $.get('/api/polls/' + id, populatePage);

    function populatePage(pollData) {
      console.log(pollData.question);
      $('#question').text(pollData.question);
      $.get('/api/polls/' + id + '/options', function(optionsData) {
        console.log(optionsData);
        optionsData.forEach(function(option) {
          $.get('/api/votes/' + option._id, function(data) {
            $('#options').append('<a class="list-group-item" href="/api/polls/' + pollData._id + '/options/' + option._id + '"><span class="badge">' + data.count + '</span>' + option.text + '</a>');
          });
        })
      });
    }
  }

  /*
  function populateVotedPage(pollData)
    var responses = pollData.responses
    var tableContents = '<tr><th>Response</th><th>Votes</th></tr>';
    responses.forEach(function(response) {
      tableContents += '<tr><td>' + response.response + '</td><td>' + response.votes + '</td></tr>';
    });
    $('#pollResponses').html(tableContents);

    var responses = pollData.responses;

    $('#pollButton').click(function(e){
      e.preventDefault();
      var text = $(e.target).text();
      resp
    })
  }
*/

});