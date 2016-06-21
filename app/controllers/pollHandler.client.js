'use strict';
/* global $, Chart, palette, creator, userId */

$(document).ready(function() {

  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);

  $.get('/api/votes', function(voteList) {
    if (voteList.indexOf(id) !== -1) {
      loadPollResults(id);
    } else if (creator === userId) {
      loadPollResults(id);
    } else {
      loadPoll(id);
    }
  });

  function loadPoll(id) {
    $('#addthis').css('display', 'none');
    $('#chartContainer').css("display", 'none');
    $('#response-intro').text("Select your response:");
    $.get('/api/polls/' + id + '/options', function(optionsData) {
      optionsData.forEach(function(option) {
        $('#options').append('<a class="list-group-item votable-option" href="/api/polls/' + id + '/options/' + option._id + '">' + option.text + '</a>');
      });
    });
  }

  function loadPollResults(id) {
    $('#addthis').css('display', 'block');
    $('#chartContainer').css("display", 'block');
    $('#response-intro').text("Votes per response")
    $('#addAnother').css("display", "none");
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
            displayChart(pollResults);
          }
        });
      });
    });
  }

  $('#addResponse').click(function(e) {
    e.preventDefault();
    $('#addResponse').css('display', 'none');
    $('#addAnother').append('<div class="well well-lg" id="addResponseForm"><div class="form-group option-group"><label>New option:</label><input type="text" class="form-control" id="response-option" placeholder="A possible response..."></div><p>Clicking Submit will add this option and register your vote for it.</p><button class="btn btn-primary" id="submit" type="submit">Submit & Vote</button><button class="btn btn-default" id="cancel">Cancel</button></div>');
  });

  $('#addAnother').on('click', '#submit', function(e) {
    e.preventDefault();
    var response = $('#response-option').val();
    if (response.length > 0) {
      var data = { "responses": [response] };
      $.post('/api/polls/' + id, data, function(result) {
        $.get('/api/polls/' + id + '/lastoption', function(lastOption) {
          window.location.href = '/api/polls/' + id + '/options/' + lastOption[0]._id;
        });
      });
    }
  })


  function displayChart(pollResults) {
    var colors = palette('cb-Spectral', 11);
    colors = colors.map(function(str) {
      return "#" + str;
    })
    var labels = [];
    var values = [];

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
    });

    if (labels.length > 10) {
      var legendLabels = labels.splice(0,10);
      legendLabels.push('All other responses');

      var legendValues = values.splice(0,10);
      var sumLowEnd = values.reduce(function(sum, cv) {
        return sum + cv;
      });

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

  }
});