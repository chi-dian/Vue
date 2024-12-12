<template>
  <div class="index-footer flex justify-center items-center min-h-screen-[600px]">
    <el-row>
      <el-col :span="21" :offset="1">
        <el-row class="mt-5 text-center">
          <hr class="my-2" />
          <!-- 禁止分行 -->
          <p class="text-gray-500 whitespace-nowrap">
            © 2024 成都理工大学——校园易购 版权所有
          </p>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
  .index-footer{
    text-decoration: none;
    font-size: 14px;
  }
  .index-footer ul>li>a{
    font-weight: bold;
  }

</style>
