

export default class RProp {
    constructor(key) {
        this.key = key;
    }
    static isRProp(target) {
        return target instanceof RProp;
    }
}
