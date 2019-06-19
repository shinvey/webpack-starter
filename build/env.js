const ENV = [
  'development',
  'staging',
  'production'
]
exports.level = env => ENV.indexOf(env)
exports.isDev = env => env === ENV[0]
exports.isStg = env => env === ENV[1]
exports.isPrd = env => env === ENV[2]
