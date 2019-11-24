import NetworkError from 'sunny-js/request/NetworkError'

/**
 * 自定义NetworkError实例message属性取值逻辑
 * 不同的网络请求库，对message对输出形式各不相同
 * EnhanceMessage方法提供定制NetworkError实例属性message内容的能力
 */
// NetworkError.EnhanceMessage = () => {}
export default NetworkError
