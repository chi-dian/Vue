import { useCookies } from '@vueuse/integrations/useCookies'
//管理用户认证Token，通过Cookie存储Token值。跨请求保持用户登录状态
// 存储在 Cookie 中的 Token 的 key
const TOKEN_KEY = 'Authorization'
//自定义钩子，用于创建和管理Cookie。cookie变量通过调用useCookies()获得，它提供了操作Cookie的方法，如获取、设置和删除。
const cookie = useCookies()

// 获取 Token 值
export function getToken() {
    return cookie.get(TOKEN_KEY)
}

// 设置 Token 到 Cookie 中
export function setToken(token) {
    return cookie.set(TOKEN_KEY, token)
}

// 删除 Token
export function removeToken() {
    return cookie.remove(TOKEN_KEY)
}
