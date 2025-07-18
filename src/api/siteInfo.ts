import request from '@/utils/request'

/**
 * 根据key获取value
 * @param {*} p
 * @returns
 */
export const getConfig = (parmas: any) => {
  return request.Get('/Sys_Config/get_config', parmas)
}
