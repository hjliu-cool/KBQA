<template>
  <div class="layout-munus">
    <div class="layout-munus-top">menu</div>
    <el-menu
      :default-active="active"
      class="el-menu-vertical"
      background-color="#000d2f"
      text-color="#fff"
      :unique-opened="true"
      @select="clickSelect"
    >
      <el-menu-item index="/home" @click="emitBreadcrumb('hiding')">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu v-for="(item, index) in munus" :key="index" :index="item.code">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="items in item.childs"
          :key="items.code"
          :index="items.url"
          @click="emitBreadcrumb(items)"
        >
          {{ items.name }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import supermunu from '../../router_menu/router.json'
import approval from '../../router_menu/approval.json'
import draftsman from '../../router_menu/draftsman.json'
import user from '../../router_menu/user.json'
import { Login, getUserInfo } from '@/api'
export default {
  props: {
    active: {
      type: String,
      default: '/home',
    },
  },
  data() {
    return {
      munus: user,
    }
  },
  methods: {
    clickSelect(index) {
      this.$router.push({
        path: index,
        query: { n: Date.now() },
      })
    },
    emitBreadcrumb(val) {
      this.$emit('getBreadcrumb', val)
    },
  },
  created() {
    let data = { username: sessionStorage.getItem('username') }
    getUserInfo(data).then((res) => {
      switch (res.userInfo.level) {
        case '2':
          this.munus = user
          break
        case '3':
          this.munus = draftsman
          break
        case '4':
          this.munus = approval
          break
        case '5':
          this.munus = supermunu
          break
        default:
          return
      }
    })
  },
}
</script>

<style lang="less">
.layout-munus {
  .layout-munus-top {
    height: 60px;
    color: #fff;
    line-height: 60px;
    font-weight: 800;
    text-align: center;
    font-size: 40px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
      sans-serif;
  }
  .el-menu-vertical {
    border: none;
    .el-menu-item {
      border-left: 5px solid #000d2f;
    }
    .el-menu-item:hover {
      border-left: 5px solid #0091ff;
    }
    .el-menu-item.is-active {
      border-left: 5px solid #0091ff;
      color: #0091ff;
    }
    .el-submenu__title {
      border-left: 5px solid #000d2f !important;
      box-sizing: border-box;
    }
    .el-submenu__title:hover {
      border-left: 5px solid #0091ff !important;
    }
  }
}
</style>
