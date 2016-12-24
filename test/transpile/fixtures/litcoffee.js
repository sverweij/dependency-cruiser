var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

export var Ching = (function() {
  var message;

  message = "nothing much";

  function Ching(message1) {
    this.message = message1;
  }

  return Ching;

})();

export var Ka = (function(superClass) {
  var NAME;

  extend(Ka, superClass);

  NAME = "FatalError";

  function Ka(message1) {
    this.message = message1;
    Ka.__super__.constructor.call(this, message);
  }

  return Ka;

})(Ching);
