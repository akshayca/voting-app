'use strict';
/* global $ */

$(document).ready(function() {
  $('#newPoll').addClass('active');

  $('#addResponse').click(function(e) {
    e.preventDefault();
    var numOptions = $('.option-group').length + 1;
    $('#responses').append('<div class="form-group option-group" id="option' + numOptions + '"><label>Option ' + numOptions + '</label><input type="text" class="form-control response-option" placeholder="A possible response..."></div>');
    $('#option' + numOptions + '>input').focus();
  })

  $('#submit').click(function(e) {
    e.preventDefault();
    var question = $('#question').val();
    var data = { question: question, creator: userId  };
    var responseOptions = [];
    $('.response-option').each(function(){
      var option = $(this).val();
      if (option) {
        responseOptions.push(option);
      }
    });
    if (responseOptions.length < 2) {
      alert("Please add at least 2 response options to your poll.");
      return;
    }
    var optionData = { responses: responseOptions }
    $.post('/api/polls', data, function(data) {
      var id = data._id;
      var url = '/api/polls/' + id;
      $.post(url, optionData, function(data2) {
        window.location.href = '/polls/' + id;
      });
    });

  })
});