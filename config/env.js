const env = process.env.NODE_ENV || 'development'

exports.env = env
exports.isProduction = env === 'production'
exports.isTest = env === 'test'
exports.isDevelopment = env === 'development'
