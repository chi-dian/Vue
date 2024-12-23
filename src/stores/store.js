import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
export default createStore({
  plugins: [
    // 创建一个持久化状态的插件
    createPersistedState({
      // 指定持久化存储的类型
      storage: window.localStorage,
      key: 'campus-trading-store',
      paths: [
        'currentUser',
        'users',
        'products',
        'cart',
        'orders',
        'reviews',
        'productReviews'
      ],
      // 定义如何从完整状态中提取和构建持久化的状态
      reducer(state) {
        return {
          currentUser: state.currentUser,
          users: state.users.map(user => ({
            id: user.id,
            useridx:user.useridx,
            username: user.username,
            password: user.password,
            avatar: user.avatar,
            phone: user.phone,
            email: user.email,
            })),
          products: state.products.map(product => ({
            id: product.id,
            title: product.title,
            description:product.description,
            price: product.price,
            stock: product.stock,
            status: product.status,
            sellerId: product.sellerId,//卖家id
            category: product.category,//产品分类
            images: product.images ? [product.images[0]] : []//产品图片
          })),
          cart: state.cart,//购物车
          orders: state.orders.map(order => ({//订单对象
            id: order.id,//订单id
            orderNo: order.orderNo,
            createTime: order.createTime,//订单创建时间
            status: order.status,//状态
            buyerId: order.buyerId,//买方id
            sellerId: order.sellerId,//卖方id
            items: order.items?.map(item => ({//订单商品项
              productId: item.productId,//商品id
              quantity: item.quantity,
              price: item.price,
              productSnapshot: {//商品快照对象
                title: item.productSnapshot.title,//商品标题
                price: item.productSnapshot.price,//价格
                images: item.productSnapshot.images ? [item.productSnapshot.images[0]] : [],//图片
                sellerId: item.productSnapshot.sellerId
              }
            })),
            totalAmount: order.totalAmount,
            receiver: order.receiver,//收货方名字
            phone: order.phone,
            address: order.address
          })),
          reviews: state.reviews,
          productReviews: state.productReviews.map(pr => ({
            productId: pr.productId,//商品id
            totalRating: pr.totalRating,//总分
            reviewCount: pr.reviewCount,//评论数
            reviews: pr.reviews.map(review => ({
              id: review.id,//评论标识符
              orderId: review.orderId,//评论关联的订单id
              productId: review.productId,//发布评论的买家id
              buyerId: review.buyerId,//发布评论的买家id
              rating: review.rating,//评论评分
              content: review.content,//评论内容
              createTime: review.createTime//评论创建时间
            }))
          }))
        }
      }
    })
  ],

  state: {
    currentUser: null,
    users: [],
    products: [],
    orders: [],
    categories: [],
    cart: {},
    reviews: [],
    productReviews: [],
    addresses: []
  },

  mutations: {
    //更新用户信息
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
    },
    //更新商品分类列表
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    //添加一个新的商品到products数组中，并设置商品的id、sellerId、createTime和status。
    ADD_PRODUCT(state, product) {
      console.log('添加商品前:', state.products)
      const newProduct = {
        ...product,
        id: state.products.length + 1,
        sellerId: state.currentUser.id,
        createTime: new Date().toISOString(),
        status: 'available'
      }
      console.log('新商品:', newProduct)
      state.products.push(newProduct)
      console.log('添加商品后:', state.products)
    },
    //更新特定商品的状态
    UPDATE_PRODUCT_STATUS(state, { productId, status }) {
      const product = state.products.find(p => p.id === productId)
      if (product) {
        product.status = status
      }
    },
    //新的订单到orders数组
    ADD_ORDER(state, order) {
      state.orders.push({
        ...order,
        id: state.orders.length + 1,
        createTime: new Date().toISOString().split('T')[0],
        status: 'pending',
        paid: false
      })
    },
    //更新特定订单的状态。
    UPDATE_ORDER_STATUS(state, { orderId, status }) {
      const order = state.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
      }
    },
    //添加新的用户
    ADD_USER(state, user) {
       state.users.push({
       ...user,
      useridx:state.users.length + 1,
      avatar: 'default-avatar.jpg',
      createTime: new Date().toISOString().split('T')[0]
       })
       },
    //删除一个商品从products数组中
    DELETE_PRODUCT(state, productId) {
      const index = state.products.findIndex(p => p.id === productId)
      if (index > -1) {
        state.products.splice(index, 1)
      }
    },
    //更新特定商品的价格和库存
    UPDATE_PRODUCT(state, { id, price, stock }) {
      const product = state.products.find(p => p.id === id)
      if (product) {
        product.price = price
        product.stock = stock
      }
    },
    //将商品添加到用户的购物车中
    ADD_TO_CART(state, { userId, productId, quantity = 1 }) {
      if (!state.cart[userId]) {
        state.cart[userId] = []
      }

      const userCart = state.cart[userId]
      const existingItem = userCart.find(item => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        userCart.push({ productId, quantity })
      }
    },
    //更新购物车中特定商品的数量
    UPDATE_CART_QUANTITY(state, { userId, productId, quantity }) {
      const userCart = state.cart[userId]
      if (userCart) {
        const item = userCart.find(item => item.productId === productId)
        if (item) {
          item.quantity = quantity
        }
      }
    },
    //从购物车中移除特定商品
    REMOVE_FROM_CART(state, { userId, productId }) {
      const userCart = state.cart[userId]
      if (userCart) {
        const index = userCart.findIndex(item => item.productId === productId)
        if (index > -1) {
          userCart.splice(index, 1)
        }
      }
    },
    //清空特定用户的购物车
    CLEAR_CART(state, userId) {
      state.cart[userId] = []
    },

    //从购物车创建一个新的订单
    CREATE_ORDER(state, order) {
      state.orders.push(order)
    },
    //支付后更新商品的库存，并可能将商品状态更新为sold_out。
    UPDATE_PRODUCT_AFTER_PAYMENT(state, { productId, quantity }) {
      const product = state.products.find(p => p.id === productId)
      if (product) {
        product.stock -= quantity
        // 如果库存为0且状态是可购买，则更新为已售罄
        if (product.stock <= 0 && product.status === 'available') {
          product.status = 'sold_out'
        }
      }
    },
    //根据orderId从orders数组中删除一个订单
    DELETE_ORDER(state, orderId) {
      const index = state.orders.findIndex(o => o.id === orderId)
      if (index > -1) {
        state.orders.splice(index, 1)
      }
    },
    //添加一个新的评论到reviews数组
    ADD_REVIEW(state, review) {
      const newReview = {
        ...review,
        id: state.reviews.length + 1
      }
      state.reviews.push(newReview)

      const productReview = state.productReviews.find(pr => pr.productId === review.productId)
      if (productReview) {
        productReview.totalRating += review.rating
        productReview.reviewCount += 1
        productReview.reviews.push(newReview)
      } else {
        state.productReviews.push({
          productId: review.productId,
          totalRating: review.rating,
          reviewCount: 1,
          reviews: [newReview]
        })
      }
    },
    //删除一个评论
    DELETE_REVIEW(state, { reviewId, productId }) {
      const reviewIndex = state.reviews.findIndex(r => r.id === reviewId)
      if (reviewIndex > -1) {
        const review = state.reviews[reviewIndex]
        state.reviews.splice(reviewIndex, 1)

        const productReview = state.productReviews.find(pr => pr.productId === productId)
        if (productReview) {
          productReview.totalRating -= review.rating
          productReview.reviewCount -= 1
          const reviewIdx = productReview.reviews.findIndex(r => r.id === reviewId)
          if (reviewIdx > -1) {
            productReview.reviews.splice(reviewIdx, 1)
          }
        }
      }
    },
    //更新用户的个人信息
    SET_USER_ID(state,{email,newId}){
      const user = state.users.find(user => user.email ===email);
      if(user){
        user.id=newId;
      }
    },
    UPDATE_USER_PROFILE(state, userData) {
      const user = state.users.find(u => u.email === userData.email)
      if (user) {
        Object.assign(user, userData)
        // 如果更新的是当前用户，也更新 currentUser
        if (state.currentUser && state.currentUser.email === userData.email) {
          state.currentUser = { ...user }
        }
      }
    },
    //更新用户的地址列表
    SET_ADDRESSES(state, addresses) {
      state.addresses = addresses
    },
    //添加一个新的地址
    ADD_ADDRESS(state, address) {
      state.addresses.push(address)
    },
    //更新特定地址的信息
    UPDATE_ADDRESS(state, updatedAddress) {
      const index = state.addresses.findIndex(addr => addr.id === updatedAddress.id)
      if (index !== -1) {
        state.addresses.splice(index, 1, updatedAddress)
      }
    },
    //从地址列表中删除一个地址
    DELETE_ADDRESS(state, addressId) {
      state.addresses = state.addresses.filter(addr => addr.id !== addressId)
    }
  },

  actions: {
    //修改！！！
    // 获取用户注册方式
    // getUserRegisterType({ state }, { loginType, account }) {
    //   // 先根据当前登录类型查找用户
    //   const user = state.users.find(u => {
    //     switch (loginType) {

    //       case 'email':
    //         return u.email === account
    //       case 'username':
    //         return u.username === account
    //     }
    //   })

    //   // 如果找到用户，返回其注册类型
    //   if (user) {
    //     return user.registerType
    //   }

    //   // 如果没找到用户，返回 null
    //   return null
    // },

    // 修改登录逻辑
    // login({ commit }, { loginType, account, password, verificationCode }) {
    //   // 先检查用户是否存在
    //   let user = null

    //   // 根据登录类型查找用户
    //   user = this.state.users.find(u => {
    //     switch (loginType) {
    //       case 'phone':
    //         return u.phone === account
    //       case 'email':
    //         return u.email === account
    //       case 'username':
    //         return u.username === account
    //     }
    //   })

    //   // 如果用户不存在
    //   if (!user) {
    //     return { success: false, message: '账号不存在，请先注册' }
    //   }

    //   // 如果不是用户名��必须使用注册时的方式登录
    //   if (loginType !== 'username' && loginType !== user.registerType) {
    //     return {
    //       success: false,
    //       message: `该账号使用${
    //         user.registerType === 'phone' ? '手机号' : '邮箱'
    //       }注册，请使用对应方式登录`
    //     }
    //   }

    //   // 用户名密码登录
    //   if (loginType === 'username') {
    //     const encryptedPassword = encryptPassword(password)
    //     if (user.password === encryptedPassword) {
    //       const { password, ...safeUser } = user
    //       commit('SET_CURRENT_USER', safeUser)
    //       return { success: true }
    //     }
    //     return { success: false, message: '用户名或密码错误' }
    //   }
    //   // 手机号或邮箱验证码登录
    //   else {
    //     if (verificationCode === '123456') { // 这里简化验证码验证
    //       const { password, ...safeUser } = user
    //       commit('SET_CURRENT_USER', safeUser)
    //       return { success: true }
    //     }
    //     return { success: false, message: '验证码错误' }
    //   }
    // },

    updateUserId({ commit }, { userIdx, newId }) {
      commit('SET_USER_ID', { userIdx, newId });
    },
    logout({ commit }) {
      commit('SET_CURRENT_USER', null)
    },
    //将新商品添加到商品列表
    addProduct({ commit }, product) {
      commit('ADD_PRODUCT', product)
    },
    //创建新订单
    // createOrder({ commit, state }, { productId, quantity }) {
    //   if (!state.currentUser) return false

    //   const product = state.products.find(p => p.id === productId)
    //   if (!product || product.status !== 'available') return false

    //   if (product.stock < quantity) {
    //     ElMessage.error('库存不足')
    //     return false
    //   }

    //   commit('ADD_ORDER', {
    //     productId,
    //     quantity,
    //     buyerId: state.currentUser.id,
    //     sellerId: product.sellerId,
    //     price: product.price * quantity
    //   })
    //   return true
    // },
    //更新特定订单的状态
    updateOrderStatus({ commit }, { orderId, status }) {
      commit('UPDATE_ORDER_STATUS', { orderId, status })
    },
    //注册逻辑!!!!更改

    //初始化商店状态
    initializeStore({ state }) {
      if (state.currentUser) {
        // 可以在这里进行一些状态的验证和清理
        // 如检查登录是否过期等
      }
    },
    //更新商品的状态
    updateProductStatus({ commit }, { productId, status }) {
      commit('UPDATE_PRODUCT_STATUS', { productId, status })
    },
    deleteProduct({ commit }, productId) {
      commit('DELETE_PRODUCT', productId)
    },
    updateProduct({ commit }, { id, price, stock }) {
      commit('UPDATE_PRODUCT', { id, price, stock })
    },
    //支付订单
    payOrder({ commit }, orderId) {
      commit('UPDATE_ORDER_STATUS', {
        orderId,
        paid: true,
        status: 'processing'
      })
      return true
    },
    //添加购物车
    addToCart({ commit, state }, { userId, productId, quantity }) {
      try {
        const product = state.products.find(p => p.id === productId)
        if (!product || product.status !== 'available' || product.stock <= 0) {
          return { success: false, message: '商品已售罄或不可购买' }
        }

        commit('ADD_TO_CART', { userId, productId, quantity })
        return { success: true }
      } catch (error) {
        console.error('添加到购物车失败:', error)
        return { success: false, message: '添加失败，请重试' }
      }
    },
    //更新购物车中商品的数量。
    updateCartQuantity({ commit, state }, { productId, quantity }) {
      const product = state.products.find(p => p.id === productId)
      if (product && quantity <= product.stock) {
        commit('UPDATE_CART_QUANTITY', { productId, quantity })
        return true
      }
      return false
    },
    //购物车中移除商品
    removeFromCart({ commit }, productId) {
      commit('REMOVE_FROM_CART', productId)
    },
    //清空购物车
    clearCart({ commit }) {
      commit('CLEAR_CART')
    },
    //从购物车创建多个订单。它检查每个商品的可用性和库存，然后创建订单并清空购物车。
    async createOrders({ commit, state, dispatch }, items) {
      const orders = []
      let hasError = false

      for (const item of items) {
        const product = state.products.find(p => p.id === item.productId)
        if (!product || product.status !== 'available' || product.stock < item.quantity) {
          hasError = true
          break
        }

        orders.push({
          productId: item.productId,
          quantity: item.quantity,
          buyerId: state.currentUser.id,
          sellerId: product.sellerId,
          price: product.price * item.quantity
        })
      }

      if (hasError) {
        return { success: false, message: '部分商品无法购买或库存不足' }
      }

      // 创建订单
      orders.forEach(order => {
        commit('ADD_ORDER', order)
      })

      // 清空购物车
      dispatch('clearCart')
      return { success: true }
    },
    async createOrder({ commit, dispatch }, orderData) {
      try {
        // 验证商品是否可购买
        for (const item of orderData.items) {
          const product = this.state.products.find(p => p.id === item.productId)

          // 检查商品是否存在且可购买
          if (!product || product.status !== 'available') {
            return {
              success: false,
              message: `商品 "${product?.title || '未知商品'}" 已下架或不可购买`
            }
          }

          // 检查库存是否充足
          if (product.stock < item.quantity) {
            return {
              success: false,
              message: `商品 "${product.title}" 库存不足，仅剩 ${product.stock} 件`
            }
          }

          // 检查是否是自己的商品
          if (product.sellerId === this.state.currentUser.id) {
            return {
              success: false,
              message: '不能购买自己发布的商品'
            }
          }
        }

        // 模拟支付过程
        await new Promise(resolve => setTimeout(resolve, 1000))
        // ... 前面的验证逻辑保持不变 ...
        // 创建订单
        const order = {
          id: this.state.orders.length + 1,
          orderNo: orderData.orderNo,
          createTime: new Date().toISOString(),
          status: 'unpaid', // 初始状态为未支付
          buyerId: this.state.currentUser.id,
          sellerId: orderData.items[0].product.sellerId,
          items: orderData.items.map(item => {
            const product = this.state.products.find(p => p.id === item.productId)
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
              productSnapshot: {
                title: product.title,
                price: product.price,
                images: product.images ? [product.images[0]] : [],
                sellerId: product.sellerId
              }
            }
          }),
          totalAmount: orderData.totalAmount,
          receiver: orderData.receiver,
          phone: orderData.phone,
          address: orderData.address
        }

        // 保存订单
        commit('CREATE_ORDER', order)

        // 处理支付
        const paymentResult = await dispatch('handlePayment', order.id)
        if (!paymentResult.success) {
          return paymentResult
        }

        // 更新商品库存
        orderData.items.forEach(item => {
          commit('UPDATE_PRODUCT_AFTER_PAYMENT', {
            productId: item.productId,
            quantity: item.quantity
          })
        })

        // 清理购物车
        if (orderData.from === 'cart') {
          orderData.items.forEach(item => {
            commit('REMOVE_FROM_CART', {
              userId: this.state.currentUser.id,
              productId: item.productId
            })
          })
        }

        return { success: true, message: '订单创建并支付成功' }
      } catch (error) {
        console.error('创建订单失败:', error)
        return { success: false, message: error.message || '创建订单失败，请重试' }
      }
    },
    //删除指定ID的订单
    async deleteOrder({ commit }, orderId) {
      try {
        commit('DELETE_ORDER', orderId)
        return { success: true }
      } catch (error) {
        console.error('删除订单失败:', error)
        return { success: false, message: '删除失败，请重试' }
      }
    },
    // 处理支付逻辑
    async handlePayment({ commit }, orderId) {
      try {
        // 这里可以添加实际的支付逻辑

        // 支付成功后更新订单状态为已支付
        commit('UPDATE_ORDER_STATUS', {
          orderId: orderId,
          status: 'paid'
        })
        return { success: true, message: '支付成功' }
      } catch (error) {
        console.error('支付失败:', error)
        return { success: false, message: '支付失败，请重试' }
      }
    },
    // 修改处理未支付订单的重新支付逻辑
    async repayOrder({ state, commit }, orderId) {
      try {
        const order = state.orders.find(o => o.id === orderId)
        if (!order) {
          return { success: false, message: '订单不存在' }
        }

        // 将订单商品重新加入购物车
        order.items.forEach(item => {
          // 检查商品是否还购买
          const product = state.products.find(p => p.id === item.productId)
          if (product && product.status === 'available' && product.stock >= item.quantity) {
            commit('ADD_TO_CART', {
              productId: item.productId,
              quantity: item.quantity
            })
          }
        })

        // 删除未支付的订单
        commit('DELETE_ORDER', orderId)

        return {
          success: true,
          message: '商品已加入购物车，请重新下单',
          redirect: '/cart' // 添加重定向标记
        }
      } catch (error) {
        console.error('重新支付失败:', error)
        return { success: false, message: '操作失败，请重试' }
      }
    },
    //添加客户评价
    async addReview({ commit }, review) {
      try {
        commit('ADD_REVIEW', review)
        return { success: true }
      } catch (error) {
        console.error('添加评价失败:', error)
        return { success: false, message: '添加评价失败，请重试' }
      }
    },
//currentuser->user绑定的 调后端的API来查询我这个user的信息
//更新用户信息的话，我就要调一个后端的API,但是它不会影响我的currentuser

    //更新用户资料
    // async updateUserProfile({ commit }, userData) {
    //   try {
    //     // 调用后端API
    //     const response = await obUserInfo();
    //     if (response.status === 'error') {
    //       // 处理错误情况
    //       if (response.code === 901) {
    //         ElMessage.error('用户登录状态异常，请重新登录');
    //         // 可能需要重定向到登录页面
    //         router.push('/login');
    //       } else {
    //         ElMessage.error(response.info);
    //       }
    //     } else {
    //       // 将获取用户数据返回到userData中储存
    //       userData.value = {
    //         ...userData.value, // 保留原来的userData
    //         ...response.data, // 用response.data中的值覆盖对应的属性
    //         avatar: response.data.avatar ?? userData.value.avatar,
    //         email: response.data.email ?? userData.value.email,
    //         birthday: response.data.birthday ?? userData.value.birthday,
    //         personIntroduction: response.data.personIntroduction ?? userData.value.personIntroduction,
    //         noticeInfo: response.data.noticeInfo ?? userData.value.noticeInfo
    //       };
    //       commit('UPDATE_USER_PROFILE', userData);
    //       return { success: true };
    //     }
    //   } catch (error) {
    //     console.error('更新用户资料失败:', error);
    //     return { success: false, message: '更新失败，请重试' };
    //   }
    // },

    async updateUserProfile({ commit }, userData) {
      try {
        // 这里可以添加与后端的交互
        commit('UPDATE_USER_PROFILE', userData)
        return { success: true }
      } catch (error) {
        console.error('更新用户资料失败:', error)
        return { success: false, message: '更新失败，请重试' }
      }
    },
    //获取指定用户的所有地址
    async getUserAddresses({ commit }, userId) {
      try {
        // 这里应该调用后端 API
        // 暂时使用 localStorage 模拟数据持久化
        const addresses = JSON.parse(localStorage.getItem(`addresses_${userId}`)) || []
        commit('SET_ADDRESSES', addresses)
        return addresses
      } catch (error) {
        console.error('获取地址列表失败:', error)
        return []
      }
    },
//用于保存一个新的用户地址。它生成一个唯一的ID，并将新地址保存到localStorage中。
    async saveUserAddress({ commit, state }, addressData) {
      try {
        // 生成唯一ID
        const id = Date.now().toString()
        const newAddress = {
          id,
          ...addressData,
          createdAt: new Date().toISOString()
        }

        // 如果设置为默认地址，需要将其他地址的默认状态取消
        if (newAddress.isDefault) {
          state.addresses.forEach(addr => {
            if (addr.userId === addressData.userId && addr.id !== id) {
              addr.isDefault = false
            }
          })
        }

        // 保存到本地存储
        const addresses = [...state.addresses, newAddress]
        localStorage.setItem(`addresses_${addressData.userId}`, JSON.stringify(addresses))

        commit('ADD_ADDRESS', newAddress)
        return { success: true }
      } catch (error) {
        console.error('保存地址失败:', error)
        return { success: false, message: '保存地址失败' }
      }
    },
    //更新一个现有的用户地址
    async updateUserAddress({ commit, state }, addressData) {
      try {
        const updatedAddresses = state.addresses.map(addr => {
          if (addr.id === addressData.id) {
            return { ...addr, ...addressData }
          }
          // 如果当前地址设为默认，其他地址取消默认
          if (addressData.isDefault && addr.userId === addressData.userId && addr.id !== addressData.id) {
            return { ...addr, isDefault: false }
          }
          return addr
        })

        localStorage.setItem(`addresses_${addressData.userId}`, JSON.stringify(updatedAddresses))
        commit('SET_ADDRESSES', updatedAddresses)
        return { success: true }
      } catch (error) {
        console.error('更新地址失败:', error)
        return { success: false, message: '更新地址失败' }
      }
    },
    //删除用户地址
    async deleteUserAddress({ commit, state }, { addressId, userId }) {
      try {
        const updatedAddresses = state.addresses.filter(addr => addr.id !== addressId)
        localStorage.setItem(`addresses_${userId}`, JSON.stringify(updatedAddresses))
        commit('DELETE_ADDRESS', addressId)
        return { success: true }
      } catch (error) {
        console.error('删除地址失败:', error)
        return { success: false, message: '删除地址失败' }
      }
    }
  },

  getters: {
    availableProducts: (state) => {
      // 返回所有未下架的商品（包括可购买和已售罄的）
      return state.products.filter(p =>
        p.status === 'available' || p.status === 'sold_out'
      )
    },
    //返回指定分类下的所有商品，包括可购买和已售罄的商品。
    getProductsByCategory: (state) => (category) => {
      // 同样修改分类过滤逻辑
      return state.products.filter(p =>
        (p.status === 'available' || p.status === 'sold_out') &&
        (category ? p.category === category : true)
      )
    },
    //返回当前用户发布的所有商品。
    getCurrentUserProducts: (state) => {
      return state.currentUser
        ? state.products.filter(p => p.sellerId === state.currentUser.id)
        : []
    },
    //返回当前用户的所有订单。
    getCurrentUserOrders: (state) => {
      return state.currentUser
        ? state.orders.filter(o => o.buyerId === state.currentUser.id)
        : []
    },
    //当前用户卖出的所有商品的订单。
    getCurrentUserSales: (state) => {
      return state.currentUser
        ? state.orders.filter(o => o.sellerId === state.currentUser.id)
        : []
    },
    //返回指定用户ID的购物车中的商品项。
    cartItems: (state) => (userId) => {
      const userCart = state.cart[userId] || []
      return userCart.map(item => {
        const product = state.products.find(p => p.id === item.productId)
        return {
          ...item,
          product
        }
      })
    },
    //返回指定用户ID的购物车中商品的总价格
    cartTotal: (state, getters) => (userId) => {
      return getters.cartItems(userId).reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
    },
    //商品的总数量
    cartItemCount: (state) => (userId) => {
      const userCart = state.cart[userId] || []
      return userCart.reduce((count, item) => count + item.quantity, 0)
    },
    //返回指定商品ID的所有评价信息
    getProductReview: (state) => (productId) => {
      const productReview = state.productReviews.find(pr => pr.productId === productId)
      if (!productReview) {
        return {
          averageRating: 0,
          reviewCount: 0,
          reviews: []
        }
      }
      return {
        averageRating: productReview.reviewCount > 0
          ? (productReview.totalRating / productReview.reviewCount).toFixed(1)
          : 0,
        reviewCount: productReview.reviewCount,
        reviews: productReview.reviews
      }
    },
    //返回指定商品ID的所有评价列表
    getProductReviews: (state) => (productId) => {
      const productReview = state.productReviews.find(pr => pr.productId === productId)
      return productReview ? productReview.reviews : []
    },
    //指定用户ID的所有地址。
    getUserAddresses: (state) => (userId) => {
      return state.addresses.filter(addr => addr.userId === userId)
    }
  }
})
