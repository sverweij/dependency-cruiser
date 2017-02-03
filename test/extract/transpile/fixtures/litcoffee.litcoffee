# Literate programming - .litcoffee extension

CoffeeScript supports literate programming - either use .litcoffee or
.coffee.md as extension and it'll magically filter out the code from
between the documentation.

## The Ching class
Here's an _extremely_ simple base class - we'll just export it and later on
it'll be extended to Ka.

    export class Ching
      message = "nothing much"

      constructor: (@message) ->

## The Ka class
It's just dummy stuff, but you can see the potential here

    export class Ka extends Ching
      NAME = "FatalError"

      constructor: (@message) ->
        super message
