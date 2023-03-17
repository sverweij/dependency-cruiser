export class Ching {
  constructor(pMessage) {
    this.pMessage = pMessage;
    this.lMessage = "nothing much";
    this.lMessage = pMessage;
  }
}
class Ka extends Ching {
  constructor(pMessage) {
    super(pMessage);
    this.pMessage = pMessage;
  }
}
Ka.NAME = "FatalError";
export { Ka };
