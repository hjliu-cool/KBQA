import request from '../request'
import apiConfig from './apiConfig'
// 登录验证
export function Login(data) {
  return request({
    url: `${apiConfig.node}/Login`,
    method: 'get',
    params: data,
  })
}

// 注册用户
export function addUserInfo(data) {
  return request({
    url: `${apiConfig.node}/addUserInfo`,
    method: 'get',
    params: data,
  })
}

// 用户信息修改
export function fixUserInfo(data) {
  return request({
    url: `${apiConfig.node}/fixUserInfo`,
    method: 'get',
    params: data,
  })
}

// 密码修改
export function fixPassword(data) {
  return request({
    url: `${apiConfig.node}/fixPassword`,
    method: 'get',
    params: data,
  })
}
// 获取所有用户信息
export function getAllUserInfo(params) {
  return request({
    url: `${apiConfig.node}/getAllUserInfo`,
    method: 'get',
    params,
  })
}

// 删除用户
export function deleteUserInfo(code) {
  return request({
    url: `${apiConfig.node}/deleteUserInfo/${code}`,
    method: 'get',
  })
}

// 根据用户名获取用户信息
export function getUserInfo(data) {
  return request({
    url: `${apiConfig.node}/getUserInfo`,
    method: 'get',
    params: data,
  })
}

// 起草合同信息
export function addContract_information(data) {
  return request({
    url: `${apiConfig.node}/addContract_information`,
    method: 'post',
    data,
  })
}
// 修改起草合同信息
export function contract_await_approval(data) {
  return request({
    url: `${apiConfig.node}/contract_await_approval`,
    method: 'post',
    data,
  })
}

// 起草合同信息获取
export function getContract_information(data) {
  return request({
    url: `${apiConfig.node}/getContract_information`,
    method: 'get',
    params: data,
  })
}
// 起草合同审批后删除，并且添加至审批后的表中
export function contract_after_approval(data) {
  return request({
    url: `${apiConfig.node}/contract_after_approval`,
    method: 'post',
    data,
  })
}

// 审批后合同获取
export function getAfterContractInformation(data) {
  return request({
    url: `${apiConfig.node}/getAfterContractInformation`,
    method: 'get',
    params: data,
  })
}
// 审批后合同获取
export function getContractCount() {
  return request({
    url: `${apiConfig.node}/getContractCount`,
    method: 'get',
  })
}
// 获取五种类型合同的数量
export function getTypeContract() {
  return request({
    url: `${apiConfig.node}/getTypeContract`,
    method: 'get',
  })
}
// 审批后合同修改是否终止合同
export function terminationContract(data) {
  return request({
    url: `${apiConfig.node}/terminationContract`,
    method: 'get',
    params: data,
  })
}

// 根据用户名查询相关合同信息
export function getContractOfUser(data) {
  return request({
    url: `${apiConfig.node}/getContractOfUser`,
    method: 'get',
    params: data,
  })
}

// 下载测试
// export function getDownload() {
//   return request.get(`${apiConfig.node}/getDownload`, {
//     responseType: 'blob',
//   })
// }

// 添加操作日志
export function addOperationLog(data) {
  return request({
    url: `${apiConfig.node}/addOperationLog`,
    method: 'get',
    params: data,
  })
}
// 查询操作日志
export function getOperationLog() {
  return request({
    url: `${apiConfig.node}/getOperationLog`,
    method: 'get',
  })
}
// 下载
export function getSqlDownload(data) {
  return request({
    url: `${apiConfig.node}/getSqlDownload`,
    method: 'get',
    params: data,
    responseType: 'blob',
  })
}
