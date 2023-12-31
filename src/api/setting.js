// 公司设置页面api
import request from '@/utils/request'
/**
 *
 *获取角色列表
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
/** *
 *
 *根据id查询企业
 */
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`
  })
}
/**
 *
 * 添加角色
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
/**
 * 根据ID获取角色详情
 *
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/**
 *
 * 根据ID更新角色
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *
 * 根据ID删除角色
 */
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
/**
 *
 * 给角色分配权限
 */
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

