'use strict';
/* global $ */

$(document).ready(function(){
  var displayedPolls = [];
  $('#allPolls').addClass('active');

  $('a.list-group-item').each(function() {
    var id = this.id
    $.get('/api/allvotes/' + id, function(votes) {
      $('#' + id + ' span').text(votes.count);
    });
  });

});
