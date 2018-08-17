class BaseError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = (new Error(message)).stack
        }
    }
}

class SettingError extends BaseError { }
class ServiceError extends BaseError { }
class MoteChatError extends BaseError { }

module.exports = {
    SettingError: SettingError,
    ServiceError: ServiceError,
    MoteChatError: MoteChatError
}