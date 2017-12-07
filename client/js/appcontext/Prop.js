export default class Prop {
    constructor(key) {
        this.key = key;
    }
    static isProp(target) {
        return target instanceof Prop;
    }

}
