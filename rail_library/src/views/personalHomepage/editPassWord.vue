<template>
  <div class="edit_password">
    <div class="title"><span>密码修改</span></div>
    <div class="password">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="当前密码：" prop="oldPassword">
          <el-input v-model.trim="ruleForm.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新的密码：" prop="newPassword">
          <el-input v-model.trim="ruleForm.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重新输入新的密码：" prop="againNewPassword">
          <el-input v-model.trim="ruleForm.againNewPassword" type="password"></el-input>
        </el-form-item>
        <div class="btn">
          <el-button @click="savePassword" type="primary">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Login, fixPassword } from '@/api'
export default {
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value) {
        if (value.length < 6) {
          callback(new Error('密码长度必须大于5位'))
        } else if (value === this.ruleForm.oldPassword) {
          callback(new Error('与当前密码相同'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateAgainPassword = (rule, value, callback) => {
      if (value) {
        if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        againNewPassword: '',
      },
      rules: {
        oldPassword: { required: true, message: '请输入当前密码', trigger: 'blur' },
        newPassword: [
          { validator: validateNewPassword, trigger: 'blur' },
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        againNewPassword: [
          { validator: validateAgainPassword, trigger: 'change' },
          { required: true, message: '请重新输入密码', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    savePassword() {
      this.$refs['ruleForm'].validate().then(() => {
        let data = {
          userName: sessionStorage.getItem('username'),
          passWord: this.ruleForm.oldPassword,
        }
        Login(data).then((res) => {
          let newdata = {
            username: sessionStorage.getItem('username'),
            password: this.ruleForm.newPassword,
          }
          fixPassword(newdata).then((res) => {
            this.$message.success(res.message)
            this.ruleForm = {
              oldPassword: '',
              newPassword: '',
              againNewPassword: '',
            }
          })
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
.edit_password {
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
  .password {
    width: 45%;
    min-width: 500px;
    margin: 30px 0 30px 50px;
    .btn {
      text-align: center;
    }
  }
}
</style>
