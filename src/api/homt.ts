import request from '@/utils/request'

/**
 * 获取socketID
 * @param {*} p
 * @returns
 */
export const getSocketId = (parmas: string) => {
  return request.Get('/Home/uuid', parmas)
}
