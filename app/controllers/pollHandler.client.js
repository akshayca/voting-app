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
      $('#chartContainer').css("display", 'none');
      $('#response-intro').text("Select your response:")
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
      $('#chartContainer').css("display", 'block');
      $('#response-intro').text("Votes per response")
      $('#question').text(pollData.question);
      $('#options').removeClass('list-group').append('<ul class="list-group"></ul>');
      var pollResults = [];
      var length;
      $.get('/api/polls/' + id + '/options', function(optionsData) {
        length = optionsData.length;
        optionsData.forEach(function(option) {
          $.get('/api/votes/' + option._id, function(data) {
            var currOption = [option.text, data.count];
            pollResults.push(currOption);
            $('ul.list-group').append('<li class="list-group-item"><span class="badge">' + data.count + '</span>' + option.text + '</a>');
            if(pollResults.length === length) {
              console.log(pollResults);
              displayChart(pollResults);
            }
          });
        })
      });
    }
  }

  function displayChart(pollResults) {
    console.log("poll results: ", pollResults);
    var colors = palette('cb-Spectral', 11);
    var labels = [];
    var values = [];

    console.log(pollResults);

    function compare(a,b) {
      if (a[1] < b[1])  {
        return 1;
      } else if (a[1] > b[1]) {
        return -1;
      } else {
        return 0;
      }
    }

    var sortedResponses = pollResults.sort(compare);
    sortedResponses.forEach(function(response) {
      labels.push(response[0]);
      values.push(response[1]);
    })

    if (labels.length > 10) {
      var legendLabels = labels.splice(0,10);
      legendLabels.push('All other responses');

      var legendValues = values.splice(0,10);
      var sumLowEnd = values.reduce(function(sum, cv) {
        return sum + cv;
      })
      legendValues.push(sumLowEnd);

      labels = legendLabels;
      values = legendValues;
    }

    var data = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }
      ]
    };

    var options = {
      cutoutPercentage: 70
    };

    var ctx = document.getElementById("pollChart").getContext("2d");

    var chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options
    });


    console.log(colors);
  }
});