import axios from 'axios';
//import { jsonToObject } from '@/store/module/jsonToObject'; // 确保路径正确



export function getCode() {
  const config = {
    method: 'get',
    url: '/work/account/checkCode',
    //params:params
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      console.log(response.data);

      return response.data; // 返回响应数据
    })
    .catch(function (error) {
      console.error(error);
      throw error; // 抛出错误，以便调用者可以处理
    });
}

export function register(nickName, email, registerPassword, checkCodeKey, checkCode) {
  var config = {
    method: 'post',
    url: `/work/account/register?nickName=${encodeURIComponent(nickName)}&email=${encodeURIComponent(email)}&registerPassword=${encodeURIComponent(registerPassword)}&checkCodeKey=${encodeURIComponent(checkCodeKey)}&checkCode=${encodeURIComponent(checkCode)}`,

  };

  console.log(config)
  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data; // 返回响应数据，方便调用者进一步处理
    })
    .catch(function (error) {
      console.log(error);
      throw error; // 将错误抛出，方便调用者进一步处理
    });
}

// 使用示例
// register('<nickName>', '<email>', '<registerPassword>', '<checkCodeKey>', '<checkCode>');
// 使用指南
// 导入函数：
// 在其他文件中，您可以导入 register 函数并使用它：

// javascript
// import { register } from './path/to/your/registerFunction'; // 确保路径正确

// // 使用 register 函数
// register('user@example.com', 'Username', 'password123', 'key123', 'code123')
//   .then(data => {
//     console.log('Registration successful:', data);
//   })
//   .catch(error => {
//     console.error('Registration failed:', error);
//   });


export function login(email, password, checkCodeKey, checkCode) {
  var config = {
    method: 'post',
    url: `/work/account/login?email=${email}&password=${password}&checkCodeKey=${checkCodeKey}&checkCode=${checkCode}`,

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

// module.exports = login; // 导出 login 函数
// 使用指南
// 导入函数：
// 在其他文件中，您可以导入 login 函数并使用它：

// javascript
// var login = require('./login'); // 确保路径正确

// // 使用 login 函数
// login('user@example.com', 'password123', 'key123', 'code123')
//   .then(data => {
//     console.log('Login successful:', data);
//   })
//   .catch(error => {
//     console.error('Login failed:', error);
//   });

/**
 * 用户登出的函数
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */

export function logOut() {
  var config = {
    method: 'get',
    url: '/work/account/logout',

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
// 在其他文件中，您可以导入 logOut 函数并使用它：

// javascript
// var logOut = require('./logOut'); // 确保路径正确

// // 使用 logOut 函数
// logOut()
//   .then(data => {
//     console.log('Logout successful:', data);
//   })
//   .catch(error => {
//     console.error('Logout failed:', error);
//   });

/**
 * 获取用户信息的函数
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function obUserInfo() {
  const config = {
    method: 'get',
    url: '/work/account/checkCode',

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
// 在其他文件中，您可以导入 obUserInfo 函数并使用它：

// javascript
// import { obUserInfo } from './path/to/your/obtainUserInformationFile'; // 确保路径正确

// // 使用 obUserInfo 函数
// obUserInfo()
//   .then(data => {
//     console.log('User information:', data);
//   })
//   .catch(error => {
//     console.error('Failed to obtain user information:', error);
//   });



/**
 * 更新用户信息的函数
 * @param {string} nickName 用户昵称
 * @param {string} avatar 用户头像
 * @param {string} sex 用户性别
 * @param {string} birthday 用户生日
 * @param {string} school 用户学校
 * @param {string} personIntroduction 用户个人简介
 * @param {string} noticeInfo 用户通知信息
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function updateUser(nickName, avatar, sex, birthday, school, personIntroduction, noticeInfo) {
  const config = {
    method: 'post',
    url: `/work/account/updateUserInfo?nickName=${encodeURIComponent(nickName)}&avatar=${encodeURIComponent(avatar)}&sex=${encodeURIComponent(sex)}&birthday=${encodeURIComponent(birthday)}&school=${encodeURIComponent(school)}&personIntroduction=${encodeURIComponent(personIntroduction)}&noticeInfo=${encodeURIComponent(noticeInfo)}`,

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
// 在其他文件中，您可以导入 updateUser 函数并使用它：

// javascript
// import { updateUser } from './path/to/your/updateUserFile'; // 确保路径正确

// // 使用 updateUser 函数
// updateUser('昵称', '头像', '性别', '生日', '学校', '个人简介', '通知信息')
//   .then(data => {
//     console.log('用户信息更新成功:', data);
//   })
//   .catch(error => {
//     console.error('用户信息更新失败:', error);
//   });



/**
 * 管理员用户登录的函数
 * @param {string} account 用户账号
 * @param {string} password 用户密码
 * @param {string} checkCodeKey 验证码密钥
 * @param {string} checkCode 验证码
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function userLogin(account, password, checkCodeKey, checkCode) {
  const config = {
    method: 'post',
    url: `/work/admin/account/login?account=${account}&password=${password}&checkCodeKey=${checkCodeKey}&checkCode=${checkCode}`,

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
// 在其他文件中，您可以导入 userLogin 函数并使用它：

// javascript
// import { userLogin } from './path/to/your/userLoginFile'; // 确保路径正确

// // 使用 userLogin 函数
// userLogin('user123', 'password123', 'key123', 'code123')
//   .then(data => {
//     console.log('登录成功:', data);
//   })
//   .catch(error => {
//     console.error('登录失败:', error);
//   });





/**
 * 检查验证码的函数
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function useCode() {
  const config = {
    method: 'get',
    url: '/work/admin/account/checkCode',

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
// 在其他文件中，您可以导入 useCode 函数并使用它：

// javascript
// import { useCode } from './path/to/your/useCodeFile'; // 确保路径正确

// // 使用 useCode 函数
// useCode()
//   .then(data => {
//     console.log('验证码检查结果:', data);
//   })
//   .catch(error => {
//     console.error('验证码检查失败:', error);
//   });


/**
 * 用户退出登录的函数
 * @returns {Promise} Axios Promise 对象，包含响应数据或错误信息
 */
export function quitLogin() {
  const config = {
    method: 'get',
    url: '/work/admin/account/logout',

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
// 在其他文件中，您可以导入 quitLogin 函数并使用它：

// javascript
// import { quitLogin } from './path/to/your/quitLoginFile'; // 确保路径正确

// // 使用 quitLogin 函数
// quitLogin()
//   .then(data => {
//     console.log('退出登录成功:', data);
//   })
//   .catch(error => {
//     console.error('退出登录失败:', error);
//   });
