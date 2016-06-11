'use strict';
/* global $ */

$(document).ready(function() {

  $('#addResponse').click(function(e) {
    e.preventDefault();
    $('#responses').append(' <div class="form-group" id="option-group"><label>Option</label><input type="text" class="form-control response-option" placeholder="A possible response..."></div>');
  })

  $('#submit').click(function(e) {
    e.preventDefault();
    var question = $('#question').val();
    var data = { question: question };
    console.log(question);
    var responseOptions = [];
    $('.response-option').each(function(){
      var option = $(this).val();
      responseOptions.push(option);
    });
    var optionData = { responses: responseOptions }
    $.post('/api/polls', data, function(data) {
      var id = data._id;
      var url = '/api/polls/' + id;
      $.post(url, optionData, function(data2) {
        console.log(data2);
      });
    });

  })
});