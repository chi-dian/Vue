<template>
  <div class="carousel-container">
    <el-carousel
      ref="carousel"
      v-model="currentIndex"
      :initial-index="currentIndex"
      :interval="2000"
      indicator-position="none"
      arrow="never"
      @change="changeHandle"
    >
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <img :src="image" class="carousel-image" alt="" />
      </el-carousel-item>
    </el-carousel>
    <div class="custom-indicator">
      <div
        v-for="(item, index) in images"
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="changeIndicator(index)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import bg1 from '../assets/img/bg.jpg'
import logo from '../assets/img/LOGO.png'

const carousel = ref(null)
const currentIndex = ref(0)

// 导入图片文件
const images = ref([
  bg1,
  logo,
  bg1,
  bg1
])

// 轮播图自动切换，赋值为自定义指示器
const changeHandle = (e) => {
  currentIndex.value = e
}

// 通过自定义指示器切换，赋值给轮播图
const changeIndicator = (index) => {
  if (carousel.value) {
    carousel.value.setActiveItem(index)
  }
  currentIndex.value = index
}
</script>

<style>
.carousel-container {
  position: relative;
}

.custom-indicator {
  position: absolute; /* 绝对定位 */
  bottom: 10px; /* 距离底部10px */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 修正水平居中 */
  display: flex;
  justify-content: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 使图片覆盖整个轮播项 */
}

.custom-indicator div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 5px;
  cursor: pointer;
}

.custom-indicator div.active {
  background-color: #333;
}
</style>
