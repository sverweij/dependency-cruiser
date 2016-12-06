export class Ching
  message = "nothing much"

  constructor: (@message) ->

export class Ka extends Ching
  NAME = "FatalError"

  constructor: (@message) ->
    super message
