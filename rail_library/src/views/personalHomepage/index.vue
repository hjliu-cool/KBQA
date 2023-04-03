<template>
  <div class="tab_pane">
    <el-tabs value="first" @tab-click="handleTabClick">
      <el-tab-pane label="用户信息" name="first">
        <userInfo v-if="index === '0'"></userInfo>
      </el-tab-pane>
      <el-tab-pane label="密码修改" name="second">
        <editPassWord v-if="index === '1'"></editPassWord>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import userInfo from './userInfo'
import editPassWord from './editPassWord'
export default {
  components: {
    userInfo,
    editPassWord,
  },
  data() {
    return {
      index: '0',
    }
  },
  methods: {
    handleTabClick(tab) {
      this.index = tab.index
    },
  },
  created() {},
}
</script>

<style lang="less" scoped>
.tab_pane {
  padding: 20px;
  background: #fff;
}
</style>
