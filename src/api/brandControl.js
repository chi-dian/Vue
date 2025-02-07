import axios from 'axios';

/**
 * 添加品牌的函数
 * @param {string} brandId 品牌ID
 * @param {string} brandDesc 品牌描述
 * @param {string} brandName 品牌名称
 * @param {string} adminToken 管理员令牌
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function addBrand(brandId, brandDesc, brandName, adminToken) {
  const config = {
    method: 'post',
    url: `/work/admin/brand/saveBrand?brandId=${brandId}&brandDesc=${brandDesc}&brandName=${brandName}`,
    headers: {
      'adminToken': adminToken,
    }
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
       // 返回响应数据
    })
    .catch(function (error) {
      console.error(error);
      throw error; // 抛出错误，以便调用者可以处理
    })
    .data();
}



// 使用指南
// 导入函数：
// 在其他文件中，您可以导入 addBrand 函数并使用它：

// javascript
// import { addBrand } from './path/to/your/addBrandFile'; // 确保路径正确

// // 使用 addBrand 函数
// addBrand('123', '品牌描述', '品牌名称', '管理员令牌')
//   .then(data => {
//     console.log('品牌添加成功:', data);
//   })
//   .catch(error => {
//     console.error('品牌添加失败:', error);
//   });



/**
 * 删除品牌的函数
 * @param {string} brandId - 品牌ID
 * @param {string} adminToken - 管理员令牌
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function delBrand(brandId) {
  var config = {
    method: 'get',
    url: `/work/admin/brand/delBrand?brandId=${brandId}`,

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

// 使用示例：
// deleteBrand('123', 'yourAdminToken')
//   .then(data => {
//     console.log('品牌删除成功:', data);
//   })
//   .catch(error => {
//     console.error('删除品牌失败:', error);
//   });

/**
 * 获取品牌列表的函数
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function getBrandList() {
  const config = {
    method: 'get',
    url: '/work/admin/brand/getBrand',
    headers: {
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
//


/**
 * 发布品牌的函数
 * @param {string} brandId - 品牌ID
 * @param {string} brandDesc - 品牌描述
 * @param {string} brandName - 品牌名称
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
 export function reviseBrand(brandId, brandDesc, brandName) {
  var config = {
    method: 'post',
    url: `/work/admin/brand/postBrand?brandId=${brandId}&brandDesc=${brandDesc}&brandName=${brandName}`,

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

// 使用示例：
// postBrand('123', '品牌描述', '品牌名称')
//   .then(data => {
//     console.log('品牌发布成功:', data);
//   })
//   .catch(error => {
//     console.error('品牌发布失败:', error);
//   });



/**
 * 根据品牌ID查找品牌的函数
 * @param {string} brandId - 品牌ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function getBrandInfoById(brandId) {
  var config = {
    method: 'get',
    url: `/work/admin/brand/findBrand?brandId=${brandId}`,

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

// 使用示例：
// findBrand('123')
//   .then(data => {
//     console.log('品牌信息:', data);
//   })
//   .catch(error => {
//     console.error('查找品牌失败:', error);
//   });
