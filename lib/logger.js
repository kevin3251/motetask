const logger = require('pino')({
    prettyPrint: {
        colorize: true,
        crlf: false,
        translateTime: true,
    }
})

module.exports = logger