import request from '@/utils/request'

/**
 * 获取socketID
 * @param {*} p
 * @returns
 */
export const getSocketId = (parmas: string) => {
  return request.Get('/WebHome/uuid', parmas)
}

/**
 * 根据key获取系统配置
 * @param {*} p
 * @returns
 */
export const getConfig = (parmas: string) => {
  return request.Get('/Sys_Config/get_config', parmas)
}

/**
 * 获取首页文章
 * @param {*} p
 * @returns
 */
export const getHomeArticles = () => {
  return request.Get('/WebArticles/get_home_articles')
}

/**
 * 根据id获取文章数据
 * @param {*} p
 * @returns
 */
export const getArticle = (parmas: string) => {
  return request.Get('/WebArticles/get_article', parmas)
}
