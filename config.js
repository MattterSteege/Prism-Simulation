const _user = {
    showDebug: false,
    showNormals: false,
    showIntersections: false,
    AmountOfRays: 100, //25: meh pc, 50: normal pc, 100: good pc, 250: beast pc
    doStagedDraw: 0, //0 is off !0 is the ms to wait before drawing the next ray


    maxLightBounces: 25,
}

const handler = {
    get(target, key) {
        if(typeof target[key] === "object" && target[key] !== null) {
            return new Proxy(target[key], handler)
        }
        return target[key]
    },
    set(target, prop, value) {
        target[prop] = value;
        s.valid = false;

        if(target.showDebug)
            console.log(`Setting ${prop} to ${value}`)
    }
}

let user = new Proxy(_user, handler)
