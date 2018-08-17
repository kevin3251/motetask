const mchat = require('motechat')
const {
    SettingError,
    MoteChatError
} = require('./Errors')

//motechat settings
let settings = {}
const moteUtil = {

    setSettings(value) {
        settings = value
    },
    isOpen(config) {
        return new Promise(resolve => {
            mchat.Open(config, result => {
                if (result.ErrCode == 0) { resolve(true) }
                else {
                    let msg = JSON.stringify(result)
                    throw new MoteChatError('motechat not open. ${msg}')
                }
            })
        })
    },
    isReg(dSIM, settingPath) {
        return new Promise(resolve => {
            mchat.Reg(dSIM, result => {
                let { ErrCode } = result
                if (ErrCode != 0) {
                    let msg = JSON.stringify(result)
                    throw new MoteChatError('motechat reg fail. ${msg}')
                }
                else {
                    let regData = result.result
                    this.updateDevice(regData, dSIM)
                    this.setEiInfo(regData, settings, settingPath)
                    resolve(true)
                }
            })
        })
    },
    updateDevice(regData, dSIM) {
        if (dSIM.SToken != regData.SToken || dSIM.EiToken != regData.EiToken) {
            dSIM.SToken = regData.SToken
            dSIM.EiToken = regData.EiToken
        }
    },
    setEiInfo(regData, settings, settingPath) {
        let { dSIM, mote } = settings
        if (regData.EiName === mote.EiName
            && regData.EiType === mote.EiType
            && regData.EiTag === mote.EiTag) {
            setting.DDN = regData.DDN
            mchat.Set({
                SToken: dSIM.SToken,
                EdgeInfo: {
                    DDN: regData.DDN,
                    EiOwner: mote.EiOwner,
                    EiName: mote.EiName,
                    EiType: mote.EiType,
                    EiTag: mote.EiTag,
                    EiLoc: mote.EiLoc
                }
            }, reply => {
                fs.writeJSONSync(settingPath, settings, err => {
                    if (err) throw new SettingError(err)
                })
            })
        }
    },
    call(target, action, data = {}, option = {

    }) {
        let { SToken } = settings.dSIM
        if (!target || (typeof target !== 'string')) {
            throw new MoteChatError('"${target}" format error.')
        }

    }
}

module.exports = moteUtil