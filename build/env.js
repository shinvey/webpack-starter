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
/**
 * 得出SVC_ENV并赋值到args.env.SVC_ENV
 * @param args
 * @returns {*|string|number|"navigate"|"same-origin"|"no-cors"|"cors"|"open"|"closed"|"readonly"|"readwrite"|"versionchange"|SVGAnimatedEnumeration|"disabled"|"hidden"|"showing"|"segments"|"sequence"}
 */
exports.svcEnv = args => {
  const env = args.env = args.env || {}
  return env.SVC_ENV = env.SVC_ENV || process.env.NODE_ENV || args.mode
}
