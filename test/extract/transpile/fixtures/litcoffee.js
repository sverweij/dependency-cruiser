// # Literate programming - .litcoffee extension

// CoffeeScript supports literate programming - either use .litcoffee or
// .coffee.md as extension and it'll magically filter out the code from
// between the documentation.

// ## The Ching class
// Here's an _extremely_ simple base class - we'll just export it and later on
// it'll be extended to Ka.
export var Ching = (function() {
  var message;

  class Ching {
    constructor(message1) {
      this.message = message1;
    }

  };

  message = "nothing much";

  return Ching;

}).call(this);

export var Ka = (function() {
  var NAME;

  // ## The Ka class
  // It's just dummy stuff, but you can see the potential here
  class Ka extends Ching {
    constructor(message1) {
      super(message);
      this.message = message1;
    }

  };

  NAME = "FatalError";

  return Ka;

}).call(this);
