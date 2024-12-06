import axios from 'axios';
import FormData from 'form-data';

/**
 * 上传图片的函数
 * @param {File} file 要上传的文件对象
 * @param {string} token 认证令牌
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function uploadIm(file, token) {
  var formData = new FormData();
  formData.append('file', file);

  var config = {
    method: 'post',
    url: `http://localhost:7071/work/file/uploadImage?file=${file.name}`,
    headers: {
      'token': token,
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
      ...formData.getHeaders()
    },
    data: formData
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
//  使用指南
//  导入函数：
//  在其他文件中，您可以导入 uploadIm 函数并使用它：

//  javascript
//  import { uploadIm } from './path/to/your/uploadImFile'; // 确保路径正确

//  // 假设您有一个文件输入元素，用户从中选择了一个文件
//  const fileInput = document.getElementById('fileInput');
//  const file = fileInput.files[0];
//  const token = '您的认证令牌';

//  // 使用 uploadIm 函数
//  uploadIm(file, token)
//    .then(data => {
//      console.log('图片上传成功:', data);
//    })
//    .catch(error => {
//      console.error('图片上传失败:', error);
//    });


/**
 * 获取资源的函数
 * @param {string} sourceName 资源名称
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function readRes(sourceName) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/file/getResource?sourceName=${sourceName}`,
    headers: {
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
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
// 在其他文件中，您可以导入 readRes 函数并使用它：

// javascript
// import { readRes } from './path/to/your/readResFile'; // 确保路径正确

// // 使用 readRes 函数
// readRes('exampleResourceName')
//   .then(data => {
//     console.log('Resource data:', data);
//   })
//   .catch(error => {
//     console.error('Failed to retrieve resource:', error);
//   });




/**
 * 上传文件的函数
 * @param {File} file 要上传的文件对象
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function upLoad(file) {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    method: 'post',
    url: `http://localhost:7071/work/admin/file/uploadImage`,
    headers: {
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)'
    }
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
    url: `http://localhost:7071/work/admin/file/getResource?sourceName=${sourceName}`,
    headers: {
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
