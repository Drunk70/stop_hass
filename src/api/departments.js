import request from '@/utils/request'
/**
 * 获取组织架构信息
 */
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

/**
 *
 *根据id删除部门
 */
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
/** *
 *新增部门
 *
*/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}
/** *
 *
 * 根据ID查询部门详情
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
/** *
 *
 * 根据ID修改部门详情
 */
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

