<template>
  <!-- <div class="login" :style="{ backgroundImage: 'url(' + login_img + ')' }"> -->
  <div>
    <div class="back"></div>
    <div class="login">
      <div class="title"><span>Company contract information management system.</span></div>
      <div class="inner">
        <div class="inputouter" :class="{ move: onezindex }">
          <div class="register" :class="{ zindex: onezindex }">
            <div class="innerdiv">
              <h1>Sign in</h1>
              <el-form
                :model="signRuleForm"
                :rules="rules_signin"
                ref="signRuleForm"
                label-width="0px"
                class="loginRuleForm"
                @keyup.enter.native="submitForm('signRuleForm')"
              >
                <el-form-item prop="userName">
                  <el-input
                    v-model.trim="signRuleForm.userName"
                    clearable
                    placeholder="请输入用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                  <el-input
                    v-model.trim="signRuleForm.passWord"
                    clearable
                    type="password"
                    placeholder="请输入密码"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="again">
                  <el-input
                    v-model.trim="signRuleForm.again"
                    clearable
                    type="password"
                    placeholder="再次确定密码"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="btnswrap">
                    <el-button
                      style="width:100%;background:#F27E00;border-color:#F27E00"
                      type="primary"
                      @click="submitForm('signRuleForm')"
                      >注册</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="loginInput">
            <div class="innerdiv">
              <h1>Login</h1>
              <el-form
                :model="loginRuleForm"
                :rules="rules"
                ref="loginRuleForm"
                label-width="0px"
                class="loginRuleForm"
                @keyup.enter.native="submitForm('loginRuleForm')"
              >
                <el-form-item prop="userName">
                  <el-input
                    v-model.trim="loginRuleForm.userName"
                    clearable
                    placeholder="用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                  <el-input
                    v-model.trim="loginRuleForm.passWord"
                    clearable
                    placeholder="密码"
                    type="password"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <div class="btnswrap">
                    <el-button
                      style="width:100%;background:#F27E00;border-color:#F27E00"
                      type="primary"
                      @click="submitForm('loginRuleForm')"
                      >登录</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="showwrap" :class="{ showwrapmove: onezindex }">
          <div class="left" :class="{ show: onezindex, 'z-index-change': !onezindex }">
            <h1>Sign in</h1>
            <div class="line"></div>
            <div class="message-wrapper">
              <div class="message">
                <div class="icon icon-foot"></div>
                No system account.
              </div>
              <div class="message">
                <div class="icon icon-foot"></div>
                Registered account number.
              </div>
              <div class="message">
                <div class="icon icon-foot"></div>
                Log in to the system.
              </div>
            </div>

            <button style="width:100%" class="btn1" @click="change">注册账号</button>
          </div>
          <div class="right" :class="{ show: !onezindex, 'z-index-change': onezindex }">
            <h1>Login</h1>
            <div class="line"></div>
            <div class="message-wrapper">
              <div class="message">
                <div class="icon icon-foot"></div>
                Have a system account.
              </div>
              <div class="message">
                <div class="icon icon-foot"></div>
                Login complete.
              </div>
              <div class="message">
                <div class="icon icon-foot"></div>
                You can get into the system.
              </div>
            </div>
            <button style="width:100%" class="btn2" @click="change">登录账号</button>
          </div>
        </div>
      </div>
      <div class="ICP">ICP备案号: <a href="http://beian.miit.gov.cn">浙ICP备2020044414号-1</a></div>
    </div>
  </div>
</template>

<script>
import { Login, addUserInfo, addOperationLog, getUserInfo } from '../../api/index'
import { dateFormat } from '@/utils'
export default {
  data() {
    const validateUserName = (rule, value, cb) => {
      if (value) {
        getUserInfo({ username: value }).then((res) => {
          if (res.userInfo) {
            cb(new Error('用户名已存在'))
          } else {
            cb()
          }
        })
      } else {
        cb(new Error('请输入用户名'))
      }
    }
    const validateAgain = (rule, value, cb) => {
      if (value) {
        this.signRuleForm.passWord === this.signRuleForm.again ? cb() : cb(new Error('密码不一致'))
      } else {
        cb(new Error('请再次输入密码'))
      }
    }
    return {
      login_img: require('../../assets/backimg.jpg'),
      loginRuleForm: {
        userName: '',
        passWord: '',
      },

      signRuleForm: {
        userName: '',
        passWord: '',
        again: '',
      },
      onezindex: false,
      rules: {
        userName: { required: true, message: '请输入用户名', trigger: 'blur' },
        passWord: { required: true, message: '请输入密码', trigger: 'blur' },
      },
      rules_signin: {
        userName: { validator: validateUserName, trigger: 'blur' },
        passWord: { required: true, message: '请输入密码', trigger: 'blur' },
        again: { validator: validateAgain, trigger: 'change' },
      },
    }
  },
  methods: {
    submitForm(formName) {
      // this.$router.push('/home')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'loginRuleForm') {
            Login(this.loginRuleForm).then((res) => {
              if (res.code !== '200') {
                this.$message.error(res.message)
                return
              }
              this.$message.success(res.message)
              sessionStorage.setItem('token', res.data.code)
              sessionStorage.setItem('username', res.data.username)
              sessionStorage.setItem('level', res.data.level)
              let log = {
                time: dateFormat(new Date()),
                message: '登录系统！',
                user: sessionStorage.getItem('username'),
              }
              addOperationLog(log).then((res) => {})
              this.$router.push('/home')
              this.$refs[formName].resetFields()
            })
          } else {
            addUserInfo(this.signRuleForm).then((res) => {
              this.$message.success(res.message)
              this.$refs[formName].resetFields()
              this.change()
            })
          }
        } else {
          return false
        }
      })
    },
    change() {
      this.onezindex = !this.onezindex
      this.$refs['loginRuleForm'].resetFields()
      this.$refs['signRuleForm'].resetFields()
    },
    lineAnimationBg() {
      function n(n, e, t) {
        return n.getAttribute(e) || t
      }
      function e(n) {
        return document.getElementsByTagName(n)
      }
      function t() {
        var t = e('script'),
          o = t.length,
          i = t[o - 1]

        return {
          l: o,
          z: n(i, 'zIndex', -2),
          o: n(i, 'opacity', 0.8),
          c: n(i, 'color', '134, 31, 230'),
          n: n(i, 'count', 99),
        }
      }
      function o() {
        ;(a = m.width =
          window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
          (c = m.height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight)
      }
      function i() {
        r.clearRect(0, 0, a, c)

        var n, e, t, o, m, l

        s.forEach(function(i, x) {
          for (
            i.x += i.xa,
              i.y += i.ya,
              i.xa *= i.x > a || i.x < 0 ? -1 : 1,
              i.ya *= i.y > c || i.y < 0 ? -1 : 1,
              r.fillRect(i.x - 0.5, i.y - 0.5, 1, 1),
              e = x + 1;
            e < u.length;
            e++
          )
            (n = u[e]),
              null !== n.x &&
                null !== n.y &&
                ((o = i.x - n.x),
                (m = i.y - n.y),
                (l = o * o + m * m),
                l < n.max &&
                  (n === y && l >= n.max / 2 && ((i.x -= 0.03 * o), (i.y -= 0.03 * m)),
                  (t = (n.max - l) / n.max),
                  r.beginPath(),
                  (r.lineWidth = t / 2),
                  (r.strokeStyle = 'rgba(' + d.c + ',' + (t + 0.2) + ')'),
                  r.moveTo(i.x, i.y),
                  r.lineTo(n.x, n.y),
                  r.stroke()))
        }),
          x(i)
      }
      var a,
        c,
        u,
        m = document.createElement('canvas'),
        d = t(),
        l = 'c_n' + d.l,
        r = m.getContext('2d'),
        x =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(n) {
            window.setTimeout(n, 1e3 / 45)
          },
        w = Math.random,
        y = { x: null, y: null, max: 2e4 }
      ;(m.id = l),
        (m.style.cssText = 'position:fixed;top:0;left:0;z-index:' + d.z + ';opacity:' + d.o),
        e('body')[0].appendChild(m),
        o(),
        (window.onresize = o),
        (window.onmousemove = function(n) {
          ;(n = n || window.event), (y.x = n.clientX), (y.y = n.clientY)
        }),
        (window.onmouseout = function() {
          ;(y.x = null), (y.y = null)
        })

      for (var s = [], f = 0; d.n > f; f++) {
        var h = w() * a,
          g = w() * c,
          v = 2 * w() - 1,
          p = 2 * w() - 1
        s.push({ x: h, y: g, xa: v, ya: p, max: 6e3 })
      }
      ;(u = s.concat([y])),
        setTimeout(function() {
          i()
        }, 100)
    },
  },
  mounted() {
    this.lineAnimationBg()
  },
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-repeat: 'no-repeat';
  display: flex;
  align-items: center;
  justify-content: center;
  .title {
    position: absolute;
    top: 0;
    font-size: 25px;
    line-height: 50px;
    color: rgba(207, 206, 220, 0.5);
    width: 100%;
    background: rgba(9, 7, 35, 0.5);
    padding: 0 20px;
    box-sizing: border-box;
    span {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  .inner {
    width: 45%;
    min-width: 800px;
    height: 60%;
    min-height: 400px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    overflow: hidden;
    position: relative;
    opacity: 0.8;
    .zindex {
      z-index: 10 !important;
    }
    .loginInput {
      padding: 0 40px;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 2;
      transition: all 0.6s ease-in-out;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      flex-direction: column;
      h1 {
        margin-bottom: 25px;
      }
    }
    .register {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 1;
      transition: all 0.6s ease-in-out;
      background-color: #fff;
      padding: 0 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      flex-direction: column;
    }
  }
  .move {
    transform: translateX(100%);
  }
  .inputouter {
    width: 50%;
    height: 100%;
    z-index: 30;
    position: absolute;
    top: 0;
    height: 100%;
    z-index: 1;
    transition: all 0.6s ease-in-out;
  }
  .showwrap {
    width: 50%;
    height: 100%;
    position: absolute;
    left: 50%;
    z-index: 100;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    .left {
      width: 100%;
      height: 100%;
      z-index: 10;
      float: left;
      background: #0f4f52;
      padding: 80px 55px;
      box-sizing: border-box;
      position: absolute;
      color: #fff;
      flex-direction: column;
      h1 {
        font-size: 50px;
      }
      .line {
        border: 1px solid yellowgreen;
        width: 100px;
      }
      .message-wrapper {
        margin-top: 80px;
        .message {
          margin-top: 20px;
          color: rgba(211, 209, 209, 0.8);
        }
      }
    }
    .right {
      position: absolute;
      float: right;
      width: 100%;
      height: 100%;
      z-index: 10;
      background: #493a57;
      padding: 80px 55px;
      flex-direction: column;
      box-sizing: border-box;
      color: #fff;
      h1 {
        font-size: 50px;
      }
      .line {
        border: 1px solid yellowgreen;
        width: 100px;
      }
      .message-wrapper {
        margin-top: 80px;
        .message {
          margin-top: 20px;
          color: rgba(211, 209, 209, 0.8);
        }
      }
    }

    h1 {
      margin-bottom: 25px;
    }
    .btn1,
    .btn2 {
      width: 150px;
      line-height: 40px;
      border-radius: 5px;
      border: 1px solid #3c5699;
      outline: none;
      color: #fff;
      background: #3c5699;
      margin-top: 25px;
    }
    .btn2 {
      background: #3c5699;
    }
  }
  .show {
    opacity: 0;
    transition: all 0.6s ease-in-out;
  }
  .z-index-change {
    z-index: 100 !important;
  }
  .showwrapmove {
    transform: translateX(-100%);
  }
  .loginRuleForm {
    width: 100%;
    margin: 50px 0 30px 0;
    .btnswrap {
      width: 100%;
      text-align: center;
    }
  }
  .innerdiv {
    width: 80%;
    height: 60%;
  }
}
.el-input__inner {
  background-color: rgba(0, 0, 0, 0.8);
}
.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 10px;
  background-size: cover;
  vertical-align: -1px;
}
.icon-foot {
  background-image: url('../../assets/icon-foot.png');
}
.ICP {
  position: absolute;
  bottom: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  a {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.5);
  }
}
.back {
  width: 100%;
  height: 100%;
  background-size: cover;
  position: absolute;
  z-index: -2;
  background-image: url('../../assets/background-img.jpg');
}
</style>
