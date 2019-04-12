// const env = "development"//开发环境
const env = "test" //测试环境
// const env = "production" //生产环境
let baseUrl = ''
switch (env) {
  case 'development': // 开发环境
    baseUrl = 'http://192.168.0.123:9999'
    break
  case 'test':
    baseUrl = 'http://192.168.0.145:9999/'
    break
  case 'production':
    baseUrl = 'https://app.58mixgo.com/'
    break
  default:
    break
}
export {
  baseUrl,
}
