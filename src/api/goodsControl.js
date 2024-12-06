import axios from 'axios';

/**
 * 添加商品的函数
 * @param {string} productId 商品ID
 * @param {string} productCover 商品封面图
 * @param {string} productName 商品名称
 * @param {string} pCategoryId 商品一级分类ID
 * @param {string} categoryId 商品二级分类ID
 * @param {string} description 商品描述
 * @param {number} price 商品价格
 * @param {string} brandId 品牌ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function addGoods(productId, productCover, productName, pCategoryId, categoryId, description, price, brandId) {
  const config = {
    method: 'post',
    url: `http://localhost:7071/work/product/addProduct?productId=${productId}&productCover=${productCover}&productName=${productName}&pCategoryId=${pCategoryId}&categoryId=${categoryId}&description=${description}&price=${price}&brandId=${brandId}`,
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
// 在其他文件中，您可以导入 addGoods 函数并使用它：

// javascript
// import { addGoods } from './path/to/your/addGoodsFile'; // 确保路径正确

// // 使用 addGoods 函数
// addGoods('123', 'cover.jpg', '商品名称', '1', '2', '商品描述', 100, 'brand123')
//   .then(data => {
//     console.log('商品添加成功:', data);
//   })
//   .catch(error => {
//     console.error('商品添加失败:', error);
//   });


/**
 * 获取产品列表的函数
 * @param {string} pageNo 页码
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function getList(pageNo) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/product/loadProducts?pageNo=${pageNo}`,
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
// 在其他文件中，您可以导入 getList 函数并使用它：

// javascript
// import { getList } from './path/to/your/getListFile'; // 确保路径正确

// // 使用 getList 函数
// getList('1')
//   .then(data => {
//     console.log('产品列表数据:', data);
//   })
//   .catch(error => {
//     console.error('获取产品列表失败:', error);
//   });


/**
 * 根据产品ID获取产品信息的函数
 * @param {string} productId 产品ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function getInfo(productId) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/product/getProductByProductId?productId=${productId}`,
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
// 在其他文件中，您可以导入 getInfo 函数并使用它：

// javascript
// import { getInfo } from './path/to/your/getInfoFile'; // 确保路径正确

// // 使用 getInfo 函数
// getInfo('123')
//   .then(data => {
//     console.log('产品信息:', data);
//   })
//   .catch(error => {
//     console.error('获取产品信息失败:', error);
//   });


/**
 * 删除商品的函数
 * @param {string} productId 要删除的商品ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function delGoods(productId) {
  const config = {
    method: 'delete', // 注意这里应该是delete方法
    url: `http://localhost:7071/work/product/deleteProduct/${productId}`, // URL应该是RESTful风格的
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
// 在其他文件中，您可以导入 delGoods 函数并使用它：

// javascript
// import { delGoods } from './path/to/your/delGoodsFile'; // 确保路径正确

// // 使用 delGoods 函数
// delGoods('123')
//   .then(data => {
//     console.log('商品删除成功:', data);
//   })
//   .catch(error => {
//     console.error('删除商品失败:', error);
//   });



/**
 * 修订商品信息的函数
 * @param {Object} params 包含商品信息的参数对象
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function reviseGoods(params) {
  const config = {
    method: 'post',
    url: `http://localhost:7071/work/product/postProductByProductId?productId=${params.productId}&productName=${params.productName}&productDescription=${params.productDescription}&pCategoryId=${params.pCategoryId}&brandId=${params.brandId}&price=${params.price}&stock=${params.stock}&imageUrl=${params.imageUrl}&tags=${params.tags}`,
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
// 在其他文件中，您可以导入 reviseGoods 函数并使用它：

// javascript
// import { reviseGoods } from './path/to/your/reviseGoodsFile'; // 确保路径正确

// // 使用 reviseGoods 函数
// reviseGoods({
//   productId: '123',
//   productName: '新产品名称',
//   productDescription: '新的产品描述',
//   pCategoryId: '1',
//   brandId: 'brand123',
//   price: 99.99,
//   stock: 100,
//   imageUrl: 'http://example.com/image.jpg',
//   tags: '标签1,标签2'
// })
// .then(data => {
//   console.log('商品修订成功:', data);
// })
// .catch(error => {
//   console.error('商品修订失败:', error);
// });


/**
 * 对商品进行评分的函数
 * @param {string} productId 商品ID
 * @param {number} rate 评分值
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function scoreGoods(productId, rate) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/product/rate?productId=${productId}&rate=${rate}`,
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
// 在其他文件中，您可以导入 scoreGoods 函数并使用它：

// javascript
// import { scoreGoods } from './path/to/your/scoreGoodsFile'; // 确保路径正确

// // 使用 scoreGoods 函数
// scoreGoods('123', 5)
//   .then(data => {
//     console.log('评分成功:', data);
//   })
//   .catch(error => {
//     console.error('评分失败:', error);
//   });

/**
 * 根据分类ID获取商品列表的函数
 * @param {string} pageNo 页码
 * @param {string} pCategoryId 分类ID
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function idGetGoods(pageNo, pCategoryId) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/product/loadProductsByCid?pageNo=${pageNo}&pCategoryId=${pCategoryId}`,
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
// 在其他文件中，您可以导入 idGetGoods 函数并使用它：

// javascript
// import { idGetGoods } from './path/to/your/idGetGoodsFile'; // 确保路径正确

// // 使用 idGetGoods 函数
// idGetGoods('1', '101')
//   .then(data => {
//     console.log('商品列表数据:', data);
//   })
//   .catch(error => {
//     console.error('获取商品列表失败:', error);
//   });



/**
 * 审核商品的函数
 * @param {string} productId 产品ID
 * @param {string} status 审核状态
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function auditGoods(productId, status) {
  const config = {
    method: 'get',
    url: `http://localhost:7071/work/admin/product/audit?productId=${productId}&status=${status}`,
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
// 在其他文件中，您可以导入 auditGoods 函数并使用它：

// javascript
// import { auditGoods } from './path/to/your/auditGoodsFile'; // 确保路径正确

// // 使用 auditGoods 函数
// auditGoods('123', 'approved')
//   .then(data => {
//     console.log('商品审核成功:', data);
//   })
//   .catch(error => {
//     console.error('商品审核失败:', error);
//   });
