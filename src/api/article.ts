import request from '@/utils/request'

/**
 * 增加浏览数
 * @param {*} p
 * @returns
 */
export const addBrowse = (parmas: string) => {
  return request.Get('/WebArticles/browse', parmas)
}

/**
 * 获取文章列表
 * @param {*} p
 * @returns
 */
export const getArticles = () => {
  return request.Get('/WebArticles/get_articles')
}

/**
 * 文章密码获取文章id
 * @param {*} p
 * @returns
 */
export const getArticleIdByPwd = (parmas: any) => {
  return request.Get('/WebArticles/get_pwd_id', parmas)
}

/**
 * 文章点赞
 * @param {*} p
 * @returns
 */
export const articleLike = (id: string) => {
  return request.Post('/WebArticles/like', null, { params: { id } })
}

/**
 * 获取文章是否已经点赞
 * @param {*} p
 * @returns
 */
export const hasLike = (id: string) => {
  return request.Get('/WebArticles/has_like', id)
}

/**
 * 获取文章评论
 * @param {*} p
 * @returns
 */
export const getComment = (id: string) => {
  return request.Get('/WebComment/get_comment', id)
}

/**
 * 添加文章评论
 * @param {*} p
 * @returns
 */
export const pushComment = (params: string) => {
  return request.Post('/WebArticles/comment', params)
}
