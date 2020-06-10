import ajax from './ajax'
import jsonp from 'jsonp'

const BASE_URL = ''

export const reqLogin = (username, password) =>
  ajax(BASE_URL + '/login', {username, password}, 'POST')

export const reqCategorys = (parentId) =>
  ajax(BASE_URL + '/manage/category/list', {parentId})
export const reqCategoryAdd = (parentId, categoryName) =>
  ajax(BASE_URL + '/manage/category/add', {parentId, categoryName}, 'POST')
export const reqCategoryUpdate = (categoryId, categoryName) =>
  ajax(BASE_URL + '/manage/category/update', {parentId, categoryName}, 'POST')
export const reqCategoryInfo = (categoryId) =>
  ajax(BASE_URL + '/manage/category/info', {categoryId})

export const reqProducts = (pageNum, pageSize) =>
  ajax(BASE_URL + '/manage/product/list', {pageNum, pageSize})
export const reqProductSearch = ({pageNum, pageSize, productType, productName}) =>
  ajax(BASE_URL + '/manage/product/search', {pageNum, pageSize, [productType]:productName})
export const reqProductAddUpdate = (product) =>
  ajax(BASE_URL + '/manage/product/'+(product._id?'update':'add'), product, 'POST')
export const reqProductUpdateStatus = (productId, status) =>
  ajax(BASE_URL + '/manage/product/updateStatus', {productId, status}, 'POST')

export const reqImgUpload = (image) =>
  ajax(BASE_URL + '/manage/img/delete', {image}, 'POST')
export const reqImgDel = (name) =>
  ajax(BASE_URL + '/manage/img/upload', {name}, 'POST')

export const reqRoles = () =>  ajax(BASE_URL + '/manage/role/list')
export const reqRoleAdd = (roleName) =>
  ajax(BASE_URL + '/manage/role/add', {roleName}, 'POST')
export const reqRoleUpdate = (role) => ajax(BASE_URL + '/manage/role/update', role, 'POST')

export const reqUsers = () => ajax(BASE_URL + '/manage/user/list')
export const reqUserAddUpdate = (user) =>
  ajax(BASE_URL + '/manage/user/'+(user._id?'update':'add'), user, 'POST')
export const reqUserDel = (userId) =>
  ajax(BASE_URL + '/manage/user/delete', {userId}, 'POST')

export const reqWeather = () => {

}


