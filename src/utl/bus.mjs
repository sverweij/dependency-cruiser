import EventEmitter from "node:events";

export const OFF = -1;
export const SUMMARY = 40;
export const INFO = 50;
export const DEBUG = 60;
export const TRACE = 70;
export const EXTRA_STRONG = 80;
export const ALL = 99;

class Bus extends EventEmitter {
  progress(pMessage, pOptions, ...pArguments) {
    this.emit("progress", pMessage, pOptions, pArguments);
  }

  summary(pMessage, pOptions, ...pArguments) {
    this.progress(pMessage, { ...pOptions, level: SUMMARY }, pArguments);
  }

  info(pMessage, pOptions, ...pArguments) {
    this.progress(pMessage, { ...pOptions, level: INFO }, pArguments);
  }

  debug(pMessage, pOptions, ...pArguments) {
    this.progress(pMessage, { ...pOptions, level: DEBUG }, pArguments);
  }
}

export const bus = new Bus();
