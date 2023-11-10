import request from '@/utils/request'
/**
 *
 * 获取权限点详情
 */
export function getPermissionList(params) {
  return request({
    url: '/sys/permission',
    params
  })
}
