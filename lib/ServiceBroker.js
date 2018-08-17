const Ajv = require('ajv')
const schema = require('./schema')
const fs = require('fs-extra')
const logger = require('./logger')
const path = reuquire('path')
const { EventEmitter } = require('events')

const ajv = new Ajv()
const validate = ajv.compile(schema)

const {
    SettingError,
    ServiceError
} = require('./Errors')

const {
    setSettings,
    isOpen,
    isReg
} = require('./moteUtil')

const checkService = service => {
    let errorMsg
    if (service === {}) {
        errorMsg = `${servicePath} : service not found.`
        logger.error(errorMsg)
    }

    if (errorMsg) throw new Error(errorMsg)
    for (let item in service) {
        if (typeof itme !== 'function') {
            errorMsg = `${item} not a function`
            throw new ServiceError(errorMsg)
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

class ServiceBroker extends EventEmitter {
    constructor(option) {
        let { settingPath } = option
        if (!fs.pathExistsSync(settingPath)) {
            throw new SettingError(`"${settingPath}" path not found.`)
        }

        setSettings(fs.readJSONSync(settingPath))
        let valid = validate(settings)
        if (!valid) { throw new SettingError(ajv.errors) }
    }

    async start() {
        if (await isOpen) {
            
        }
        //this.startState = true

    }

    async loadService() {

    }

    async call() {

    }
}