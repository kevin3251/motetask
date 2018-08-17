const Ajv = require('ajv')
const schema = {
    type: 'object',
    required: ['DDN', 'mote', 'dSIM', 'config'],
    properties: {
        DDN: { type: 'string' },
        mote: {
            type: 'object',
            required: ['EiOwner', 'EiName', 'EiType', 'EiTag', 'EiLoc'],
            properties: {
                EiOwner: { type: 'string' },
                EiName: { type: 'string' },
                EiType: { type: 'string' },
                EiTag: { type: 'string' },
                EiLoc: { type: 'string' }
            }
        },
        dSIM: {
            type: 'object',
            required: ['SToken', 'EiToken', 'WIP', 'LIP'],
            properties: {
                SToken: { type: 'string' },
                EiToken: { type: 'string' },
                WIP: { type: 'string' },
                LIP: { type: 'string' }
            }
        },
        config: {
            type: 'object',
            required: ['AppName', 'AppKey', 'DCenter', 'IOC', 'UseWeb', 'WebPort', 'WebEntry'],
            properties: {
                AppName: { type: 'string' },
                AppKey: { type: 'string' },
                DCenter: { type: 'string' },
                IOC: { type: 'string' },
                UseWeb: { type: 'string' },
                WebPort: { type: 'string' },
                WebEntry: { type: 'string' }
            }
        }
    },
}

const data = {
    DDN: "",
    mote: {
        EiOwner: "",
        EiName: "node-red",
        EiType: ".bot",
        EiTag: "#bot",
        EiLoc: ""
    },
    dSIM: {
        SToken: "",
        EiToken: "",
        WIP: "",
        LIP: ""
    },
    config: {
        AppName: "node-red",
        AppKey: "1u6WauSf",
        DCenter: "dc@202.153.173.253:6780",
        IOC: "",
        UseWeb: "",
        WebPort: "",
        WebEntry: {}
    }
}

const ConfigError = (errors) => {
    let error = errors[0]
    return new Error(`${error.dataPath} ${error.message}`)
}

let ajv = new Ajv()
let valid = ajv.validate(schema, data)
if (!valid) {
    throw ConfigError(ajv.errors)
    //console.log(ajv.errors)
}