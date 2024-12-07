// api.js
import axios from 'axios';


const loadCategory = (pageNo) => {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/category/loadCategory?pageNo=${pageNo}`,
    headers: {
      'User-Agent': ''
    }
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data; // 使用转换函数
    })
    .catch(function (error) {
      console.error(error);
      throw error; // 将错误抛出，以便调用者可以处理
    });
};

export default loadCategory;


/**
 * 保存类别信息的函数
 * @param {string} pCategoryId 父类别ID
 * @param {string} categoryCode 类别代码
 * @param {string} categoryName 类别名称
 * @param {string} categoryId 类别ID
 * @param {string} icon 类别图标
 * @param {string} background 类别背景图
 * @param {string} adminToken 管理员令牌
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function addClazz(pCategoryId, categoryCode, categoryName, categoryId, icon, background, adminToken) {
  const config = {
    method: 'post',
    url: `http://localhost:7071/work/admin/category/saveCategory?pCategoryId=${pCategoryId}&categoryCode=${categoryCode}&categoryName=${categoryName}&categoryId=${categoryId}&icon=${icon}&background=${background}`,
    headers: {
      'adminToken': adminToken,
      'User-Agent': ''
    }
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data; // 返回响应数据
    })
    .catch(function (error) {
      console.error(error);
      throw error; // 抛出错误，以便调用者可以处理
    });
}
// 使用指南
// 导入函数：
// 在其他文件中，您可以导入 addClazz 函数并使用它：

// javascript
// import { addClazz } from './path/to/your/addClazzFile'; // 确保路径正确

// // 使用 addClazz 函数
// addClazz('1', 'CODE123', '类别名称', '123', 'iconUrl', 'backgroundUrl', 'adminTokenValue')
//   .then(data => {
//     console.log('类别保存成功:', data);
//   })
//   .catch(error => {
//     console.error('类别保存失败:', error);
//   });



/**
 * 删除班级类别的函数
 * @param {string} categoryId 要删除的班级类别ID
 * @param {string} adminToken 管理员令牌
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function delClazz(categoryId, adminToken) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/admin/category/delCategory?categoryId=${categoryId}`,
    headers: {
      'adminToken': adminToken,
      'User-Agent': ''
    }
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data; // 返回响应数据
    })
    .catch(function (error) {
      console.error(error);
      throw error; // 抛出错误，以便调用者可以处理
    });
}
// 使用指南
// 导入函数：
// 在其他文件中，您可以导入 delClazz 函数并使用它：

// javascript
// import { delClazz } from './path/to/your/delClazzFile'; // 确保路径正确

// // 使用 delClazz 函数
// delClazz('123', 'yourAdminToken')
//   .then(data => {
//     console.log('班级类别删除成功:', data);
//   })
//   .catch(error => {
//     console.error('删除班级类别失败:', error);
//   });


/**
 * 加载分类信息的函数
 * @param {string} pageNo 页码
 * @param {string} adminToken 管理员令牌
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function showClazz(pageNo, adminToken) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/admin/category/loadCategory?pageNo=${pageNo}`,
    headers: {
      'adminToken': adminToken,
      'User-Agent': ''
    }
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data; // 返回响应数据
    })
    .catch(function (error) {
      console.error(error);
      throw error; // 抛出错误，以便调用者可以处理
    });
}
// 使用指南
// 导入函数：
// 在其他文件中，您可以导入 showClazz 函数并使用它：

// javascript
// import { showClazz } from './path/to/your/showClazzFile'; // 确保路径正确

// // 使用 showClazz 函数
// showClazz('1', 'yourAdminToken')
//   .then(data => {
//     console.log('分类信息:', data);
//   })
//   .catch(error => {
//     console.error('获取分类信息失败:', error);
//   });

