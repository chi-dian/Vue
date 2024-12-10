import axios from 'axios';
import FormData from 'form-data';


/**
 * 上传文件的函数
 * @param {string} filePath - 要上传的文件路径
 * @param {string} token - 用户的认证 token
 * @returns {Promise} - 返回一个 Promise，解析为上传结果
 */
export function userUpLoad(file) {
  return new Promise((resolve, reject) => {
    // 创建 FormData 实例
    const formData = new FormData();
    formData.append('file', file); // 直接使用文件对象

    // 准备上传配置
    const config = {
      method: 'post',
      url: '/work/file/uploadImage', // 确保这是正确的上传 URL
      headers: {
        'Content-Type': 'multipart/form-data',

      },
    };

    // 使用 axios 发送请求
    axios({
      ...config,
      data: formData, // 将 FormData 作为请求体
    })
    .then(response => {
      // 成功时，将响应数据传递出去
      resolve(response.data);
    })
    .catch(error => {
      // 失败时，将错误信息传递出去
      reject(error);
    });
  });
}
// // 使用示例
// const filePath = '<file>'; // 替换为实际文件路径
// const token = '<token>'; // 替换为实际 token

// upLoad(filePath, token)
//     .then(data => {
//         console.log('上传成功:', JSON.stringify(data));
//     })
//     .catch(error => {
//         console.log('上传失败:', error);
//     });


/**
 * 获取资源的函数
 * @param {string} sourceName 资源名称
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */

// 封装readRes函数，用于获取资源
export function readRes(sourceName) {
  var config = {
    method: 'get',
    url: `/work/file/getResource?sourceName=${sourceName}`,

  };

  return axios(config)
    .then(function (response) {
      // 处理成功的响应
      return response.data;
    })
    .catch(function (error) {
      // 处理错误情况
      console.error(error);
      throw error; // 将错误抛出，以便调用者可以进一步处理
    });
}

// // 使用readRes函数
// readRes('your-source-name')
//   .then(data => {
//     console.log(JSON.stringify(data));
//   })
//   .catch(error => {
//     console.error('Failed to read resource:', error);
//   });




/**
 * 上传文件的函数
 * @param {File} file 要上传的文件对象
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function admiUpLoad(file) {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    method: 'post',
    url: `/work/admin/file/uploadImage`,
  };

  // 注意：Axios 会自动将 FormData 转换为正确的格式，并设置适当的 headers
  return axios({
    ...config,
    data: formData
  })
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
// 在其他文件中，您可以导入 upLoad 函数并使用它：

// javascript
// import { upLoad } from './path/to/your/upLoadFile'; // 确保路径正确

// // 假设您有一个文件输入元素，用户从中选择了一个文件
// const fileInput = document.getElementById('fileInput');
// const file = fileInput.files[0];

// // 使用 upLoad 函数
// upLoad(file)
//   .then(data => {
//     console.log('文件上传成功:', data);
//   })
//   .catch(error => {
//     console.error('文件上传失败:', error);
//   });



/**
 * 获取资源的函数
 * @param {string} sourceName 资源名称
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function readResources(sourceName) {
  const config = {
    method: 'get',
    url: `/work/admin/file/getResource?sourceName=${sourceName}`,

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
// 在其他文件中，您可以导入 readResources 函数并使用它：

// javascript
// import { readResources } from './path/to/your/readResourcesFile'; // 确保路径正确

// // 使用 readResources 函数
// readResources('exampleResourceName')
//   .then(data => {
//     console.log('Resource data:', data);
//   })
//   .catch(error => {
//     console.error('Failed to retrieve resource:', error);
//   });
