'use strict';

(function() {

  function inherit(child, parent) {
    var TempConstructor = function() {};
    TempConstructor.prototype = parent.prototype;
    child.prototype = new TempConstructor();
    child.prototype.constructor = child;
  }

  window.inherit = inherit;

})();
