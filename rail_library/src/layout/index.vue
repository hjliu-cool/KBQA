<template>
  <div>
    <el-container class="wraper">
      <span
        class="datac-aside_slider"
        :class="{ closeAside_slider: closeAside }"
        @click="handleCollapse"
      >
      </span>
      <el-aside width="250px" class="aside" :class="{ closeAsideWidth: closeAside }">
        <Menu @getBreadcrumb="breadcrumb" :active="active"></Menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="title">公司合同信息管理系统</div>
          <div class="user-info">
            <el-dropdown>
              <span class="el-dropdown-link">
                欢迎登录！{{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-user" @click.native="personalHomepage">
                  个人主页
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-bicycle" @click.native="signOut">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <div class="page-name-wrap">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="gohome" class="home">
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="show">{{ pageInfo.father }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="show">{{ pageInfo.page }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer height="30px"
          >Copyright ©2020-2021 yujh Corporation, All Rights Reserved</el-footer
        >
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Menu from './menu'
import '../style/layout.less'

export default {
  watch: {
    $route: {
      handler(route) {
        if (route.path.startsWith('/redirect')) {
          return false
        }
        this.getBreadcrumb()
      },
    },
  },
  components: { Menu },
  data() {
    return {
      closeAside: false,
      username: '',
      pageInfo: {
        father: '',
        page: '',
      },
      show: false,
      active: '',
      routeList: [{ meta: this.$route.meta, path: this.$route.fullPath }],
    }
  },
  methods: {
    getBreadcrumb() {
      const { meta = {}, matched = [] } = this.$route
      // console.log('this.routeList', this.routeList)
      // console.log('this.router', this.$router)
      // // breadcrumd = false 不加入面包屑
      // // entry = false  属于一级路由 不能被首页以外的地址跳转
      // const breadcrumb = this.routeList
      // // if (meta.breadcrumb !== false) {
      // this.routeList = breadcrumb.concat(matched.slice(1))
      // // }
      // // console.log('this.routeLis', this.routeLis)
    },
    personalHomepage() {
      this.$router.push({
        path: '/personalHomepage',
        query: { n: Date.now() },
      })
      this.pageInfo = {
        father: '个人管理',
        page: '个人主页',
      }
      this.active = '/personalHomepage'
      this.show = true
    },
    signOut() {
      this.$confirm('是否退出当前用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          sessionStorage.setItem('token', '')
          sessionStorage.setItem('username', '')
          sessionStorage.setItem('level', '')
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    handleCollapse() {
      this.closeAside = !this.closeAside
    },
    breadcrumb(val) {
      if (val === 'hiding') {
        this.active = '/home'
        this.show = false
      } else {
        this.pageInfo = {
          father: val.father,
          page: val.name,
        }
        this.active = val.url
        this.show = true
      }
    },
    gohome() {
      this.$router.push({
        path: '/home',
        query: { n: Date.now() },
      })
      this.show = false
      this.active = '/home'
    },
  },
  created() {
    this.username = sessionStorage.getItem('username')
    if (this.username === '' || this.username === null) {
      this.$message.error('请先登录')
      this.$router.push('/login')
    }
  },
}
</script>
<style lang="less" scoped>
.header-menus {
  float: left;
  .menus {
    width: 100px;
    line-height: 60px;
  }
}
.user-info {
  float: right;
  line-height: 60px;
  width: 200px;
}
.el-dropdown-link {
  color: #fff;
}
.home {
  font-weight: 800;
  cursor: pointer;
}
.title {
  // display: inline-block;
  color: #fff;
  line-height: 60px;
  font-weight: 800;
  font-size: 20px;
  float: left;
}
</style>
