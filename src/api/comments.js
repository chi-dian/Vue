import axios from 'axios';

/**
 * 发布评论的函数
 * @param {string} productId 产品ID
 * @param {string} content 评论内容
 * @param {string} imgPath 图片路径
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function leaveComment(productId, content, imgPath) {
  const config = {
    method: 'post',
    url: `http://localhost:7071/web/comment/postComment?productId=${productId}&content=${encodeURIComponent(content)}&imgPath=${encodeURIComponent(imgPath)}`,
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
// 在其他文件中，您可以导入 leaveComment 函数并使用它：

// javascript
// import { leaveComment } from './path/to/your/leaveCommentFile'; // 确保路径正确

// // 使用 leaveComment 函数
// leaveComment('123', '这是评论内容', 'http://example.com/image.jpg')
//   .then(data => {
//     console.log('评论发布成功:', data);
//   })
//   .catch(error => {
//     console.error('评论发布失败:', error);
//   });


/**
 * 加载商品评论的函数
 * @param {string} productId 商品ID
 * @param {string} pageNo 页码
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function showComment(productId, pageNo) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/web/comment/loadComment?productId=${productId}&pageNo=${pageNo}`,
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
// 在其他文件中，您可以导入 showComment 函数并使用它：

// javascript
// import { showComment } from './path/to/your/showCommentFile'; // 确保路径正确

// // 使用 showComment 函数
// showComment('123', '1')
//   .then(data => {
//     console.log('商品评论数据:', data);
//   })
//   .catch(error => {
//     console.error('获取商品评论失败:', error);
//   });

/**
 * 获取顶级评论的函数
 * @param {string} commentId 评论ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function topComment(commentId) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/web/comment/topComment?commentId=${commentId}`,
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
// 在其他文件中，您可以导入 topComment 函数并使用它：

// javascript
// import { topComment } from './path/to/your/topCommentFile'; // 确保路径正确

// // 使用 topComment 函数
// topComment('123')
//   .then(data => {
//     console.log('顶级评论数据:', data);
//   })
//   .catch(error => {
//     console.error('获取顶级评论失败:', error);
//   });


/**
 * 取消置顶评论的函数
 * @param {string} commentId 评论ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function cancelTop(commentId) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/web/comment/cancelTopComment?commentId=${commentId}`,
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
// 在其他文件中，您可以导入 cancelTop 函数并使用它：

// javascript
// import { cancelTop } from './path/to/your/cancelTopFile'; // 确保路径正确

// // 使用 cancelTop 函数
// cancelTop('123')
//   .then(data => {
//     console.log('取消置顶评论成功:', data);
//   })
//   .catch(error => {
//     console.error('取消置顶评论失败:', error);
//   });


/**
 * 删除用户评论的函数
 * @param {string} commentId 要删除的评论ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function delComment(commentId) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/web/comment/userDelComment?commentId=${commentId}`,
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
// 在其他文件中，您可以导入 delComment 函数并使用它：

// javascript
// import { delComment } from './path/to/your/delCommentFile'; // 确保路径正确

// // 使用 delComment 函数
// delComment('123')
//   .then(data => {
//     console.log('评论删除成功:', data);
//   })
//   .catch(error => {
//     console.error('删除评论失败:', error);
//   });
