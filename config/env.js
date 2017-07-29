const env = process.env.NODE_ENV || 'development'

exports.env = env
exports.isProduction = env === 'production'
exports.isTesting = env === 'testing'
exports.isDevelopment = env === 'development'
