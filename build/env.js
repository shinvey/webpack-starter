const ENV = [
  'development',
  'staging',
  'production'
]

ENV.forEach((env, lvl) => {
  exports[env] = lvl
})

exports.level = env => ENV.indexOf(env)
exports.isDev = env => env === ENV[0]
exports.isStg = env => env === ENV[1]
exports.isPrd = env => env === ENV[2]
exports.svcEnv = args => {
  const env = args.env || {}
  return env.SVC_ENV || process.env.NODE_ENV || args.mode
}
