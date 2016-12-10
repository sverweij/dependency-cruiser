export class Ching {
    private lMessage = "nothing much";
    constructor(public pMessage: string) {
        this.lMessage = pMessage;
    }
}

export class Ka extends Ching {
    public static NAME = "FatalError";
    constructor(public pMessage: string) {
        super(pMessage);
    }
}
