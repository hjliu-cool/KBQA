<template>
  <div class="personal-homepage">
    <div class="title"><span>用户信息</span></div>
    <div class="userinfo">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名：">
          {{ ruleForm.username }}
        </el-form-item>
        <el-form-item label="权限：">
          {{ ruleForm.level }}
        </el-form-item>
        <el-form-item label="真实姓名：" prop="name">
          <el-input v-model.trim="ruleForm.name" :disabled="exit"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="ruleForm.sex" :disabled="exit">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄：" prop="age">
          <el-input v-model.trim="ruleForm.age" :disabled="exit"></el-input>
        </el-form-item>
        <el-form-item label="公司：" prop="company">
          <el-input v-model.trim="ruleForm.company" :disabled="exit"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model.trim="ruleForm.phone" maxlength="11" :disabled="exit"></el-input>
        </el-form-item>
        <div class="btn">
          <el-button @click="exitUserInfo" type="primary">编辑</el-button>
          <el-button @click="saveUserInfo" type="primary">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUserInfo, fixUserInfo } from '@/api'
export default {
  data() {
    return {
      ruleForm: {
        username: '',
        name: '',
        age: '',
        company: '',
        level: '',
        phone: '',
        sex: '',
      },
      exit: true,
    }
  },
  methods: {
    exitUserInfo() {
      this.exit = false
    },
    saveUserInfo() {
      fixUserInfo(this.ruleForm).then((res) => {
        this.$message.success(res.message)
        this.exit = true
      })
    },
  },
  created() {
    let data = {
      username: sessionStorage.getItem('username'),
    }
    getUserInfo(data).then((res) => {
      this.ruleForm = { ...res.userInfo }
    })
  },
}
</script>

<style lang="less" scoped>
.personal-homepage {
  background: #fff;
  .title {
    color: #333;
    font-size: 16px;
    line-height: 56px;
    ::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 0;
      border-bottom: 26px solid #0091ff;
      border-right: 4px solid transparent;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 12px;
    }
  }
  .userinfo {
    width: 50%;
    margin: 30px 0 30px 50px;
    .btn {
      text-align: center;
    }
  }
}
</style>
