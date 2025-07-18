import request from '@/utils/request'

/**
 * 添加留言
 * @param {*} p
 * @returns
 */
export const addComment = (parmas: string) => {
  return request.Post('/WebComment/comment', parmas)
}

/**
 * 添加留言
 * @param {*} p
 * @returns
 */
export const getCommentByType = (parmas: string) => {
  return request.Get('/WebComment/get_comment', parmas)
}
