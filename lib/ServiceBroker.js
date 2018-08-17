const mchat = require('motechat')
const Ajv = require('ajv')
const schema = require('./schema')
const fs = require('fs-extra')
const logger = require('./logger')
const path = require('path')
const { EventEmitter } = require('evnets')

const ajv = new Ajv()
const validate = ajv.compile(schema)

//motechat settings
let settings

// get Config Error
const ConfigError = (errors) => {
    let error = errors[0]
    return new Error(`${error.dataPath} ${error.message}`)
}

const isOpen = (config) => {
    return new Promise(resolve => {
        mchat.Open(config, result => resolve(result.ErrCode == 0))
    })
}

const isReg = (dSIM) => {
    return new Promise(resolve => {
        mchat.Reg(dSIM, result => resolve(result))
    })
}

const updateDevice = (result, dSIM) => {
    if (dSIM.SToken != result.SToken || dSIM.EiToken != result.EiToken) {
        dSIM.SToken = result.SToken
        dSIM.EiToken = result.EiToken
    }
}

const setEiInfo = (result, settings, settingPath) => {
    let { dSIM, mote } = settings
    if (result.EiName === mote.EiName && result.EiType === mote.EiType && result.EiTag === mote.EiTag) return

    settings.DDN = result.DDN
    mchat.Set({
        SToken: dSIM.SToken,
        EdgeInfo: {
            DDN: result.DDN,
            EiOwner: mote.EiOwner,
            EiName: mote.EiName,
            EiType: mote.EiType,
            EiTag: mote.EiTag,
            EiLoc: mote.EiLoc
        }
    }, reply => {
        fs.writeJSONSync(settingPath, settings, err => {
            if (err) throw new Error(err)
        })
    })
}

const checkService = service => {
    let errorMsg
    if (service === {}) {
        errorMsg = `${servicePath} : service not found.`
        logger.error(errorMsg)
    }

    if (errorMsg) throw new Error(errorMsg)
    for (let item in service) {
        if (typeof item !== 'function') {
            errorMsg = `"${item}" not a function`
            throw new TypeError(errorMsg)
        }
    }
}

const getXRPC = actions => {
    let xrpc = {}
    const actionToXRPC = act => {
        return (head, body) => {
            try { act(body) } catch (err) {
                logger.error(err)
            }
        }
    }

    for (let item in actions) {
        xrpc[item] = actionToXRPC(actions[item])
    }
    return xrpc
}

/**
 * The motechat call api
 * @param {string} target the Device DDN
 * @param {string} action 
 * @param {Object} data 
 * @param {Object} option 
 */
const mcCall = (target, action, data = {}, option = {

}) => {
    let { SToken } = settings.dSIM
    if (!target || (typeof target !== 'string')) {
        throw new TypeError(`target ${target} `)
    }
}

class ServiceBroker extends EventEmitter {

    constructor(option) {
        if (this.settingPath !== option.path) {
            this.setup(option.path)
        }
    }

    async setup(optPath) {
        this.settingPath = optPath
        let settingPath = optPath
        if (!fs.pathExistsSync(settingPath)) { throw new Error('path not found') }

        settings = fs.readJSONSync(settingPath)
        let valid = validate(settings)
        if (!valid) { throw ConfigError(ajv.errors) }

        let opened = await isOpen(settings.config)
        if (!opened) {
            throw new Error('motechat not open.')
        }

        let regData = await isReg(settings.dSIM)
        if (regData.ErrCode != 0) {
            throw new Error('motechat reg fail.')
        }

        this.updateDevice(regData.result, settings.dSIM)
        this.setEiInfo(regData.result, settings, settingPath)
        logger.info('Broker setup...')
    }

    /**
     * 
     * @param {string} servicePath load the service file from path 
     */
    async loadService(servicePath) {

        let isExist = await fs.pathExists(servicePath)
        let {
            init = async () => { },
            stopped = async () => { },
            ...actions
        } = require(servicePath)

        process.on('exit', stopped)
        init().then(() => {
            checkActions(actions)
            let xrpc = getXRPC(actions)

            mchat.Isolated(xrpc, result => {
                logger.log(`${servicePath} load service : ${result}`)
            })
        })
    }

    async call() {

    }
}

let broker = null
module.exports = {
    /**
     * 
     * @param {Object} option
     * @param {string} option.path The path of setting file
     */
    getServiceBroker(option) {
        if (broker) {
            logger.warn('ServiceBroker has already been initialized.')
            return broker
        }

        let broker = new ServiceBroker(option)
        return borker
    }
}