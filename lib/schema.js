module.exports = {
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