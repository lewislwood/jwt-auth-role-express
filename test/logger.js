// const winston = require('winston')


const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, json } = format;

const productionLogger = () => {
    
    
    return createLogger({
        level: 'debug',
        format: format.simple(),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'tests.log',
                
              })
        ],
      });
}



  module.exports = productionLogger;