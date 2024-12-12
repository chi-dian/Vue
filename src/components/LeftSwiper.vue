<template>
  <div class="carousel-container">
    <div class="arrow left-arrow" @click="prevSlide">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="arrow right-arrow" @click="nextSlide">
      <i class="el-icon-arrow-right"></i>
    </div>
    <el-carousel
      ref="carousel"
      v-model="currentIndex"
      :initial-index="currentIndex"
      :interval="1500"
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

// 上一张
const prevSlide = () => {
  if (carousel.value) {
    carousel.value.prev()
  }
}

// 下一张
const nextSlide = () => {
  if (carousel.value) {
    carousel.value.next()
  }
}
</script>

<style>

</style>
