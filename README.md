# Voting App

### Hi!

My name is [Luke Walker](http://lukewalker.org), and I'm currently teaching myself to build cool things on the web by working through Free Code Camp's curriculum. [This site is a part of that.](https://www.freecodecamp.com/challenges/build-a-voting-app)

It's my first full-stack Javascript site. I built it with Node/Express/MongoDB (using Clementine.js as boilerplate), with Passport.js for authentication, Swig for templates, Bootstrap to keep things looking decent, and Chart.js for beautiful charts, and [this palette generator from Google](https://github.com/google/palette.js/tree/master) for the color scheme.

You can play with my voting app on heroku here: https://ubershibs-voting-app.herokuapp.com

I'd love any feedback you have! Send along an email to luke dot walker at gmail dot com.

##Changes:
- 0.2 June 21, 2016
  - Added a "Register" button to clarify vs. single "Login" button
  - Refactored All Polls and individual poll pages, and the user profile page to include more content on initial pageload, reducing the number of AJAX calls.
  - Poll creators always see the results view of their polls (and as a result, can no longer vote on their own polls.)
- 0.1 Initial launch

## To-do:
- Move view logic entirely to Swig templates — completed for the index and poll views - and remove duplicative routes.
- Add more authentication options/local.
- Make things prettier.
- Maybe change voting to be one vote per poll per user/IP address (for guests), rather than one vote per poll per session? I've left it like this to facilitate testing for now.

--------

The MIT License (MIT)
Copyright (c) 2016 Luke Walker

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.