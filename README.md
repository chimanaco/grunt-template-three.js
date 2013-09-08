grunt-template-three.js
=======================

template sets for a three.js sketch to build with grunt 

Getting started
-----

* install node_modules<br>
  - $npm install

* start watch & connect<br>
  - $grunt start

* live reload<br>
  - ./deploy/ -> http://localhost:9000/

* deploy (Javascript)
  - ./src/foo.js + src/bar.js -> deploy/js/<%= pkg.name %>.js & deploy/js/<%= pkg.name %>.min.js<br>

* deploy (CSS / SASS)
  - ./scss/foo.scss -> ./deploy/foo.css<br>

* deploy (html)
  - src/index.html -> deploy/index.html

* img
  - They have to be in ./deploy/img/

