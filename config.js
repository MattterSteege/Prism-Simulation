const _user = {
    showDebug: false,
    showNormals: false,
    showIntersections: false,

    maxLightBounces: 3,
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

const user = new Proxy(_user, handler)