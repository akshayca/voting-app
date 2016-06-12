'use strict';
/* global $ */

$(document).ready(function()   {

  $('#searchSubmit').click(function(e) {
    e.preventDefault();
    var queryTerm = $('#searchTerms').val();
    if (!queryTerm) {
      return;
    } else {
      window.location.href = '/polls?q=' + encodeURIComponent(queryTerm);
    }
  })
});