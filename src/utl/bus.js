const EventEmitter = require("events");

const gBus = new EventEmitter();

module.exports = gBus;
module.exports.levels = {
  OFF: -1,
  SUMMARY: 40,
  INFO: 50,
  DEBUG: 60,
  TRACE: 70,
  EXTRA_STRONG: 80,
  ALL: 99,
};
