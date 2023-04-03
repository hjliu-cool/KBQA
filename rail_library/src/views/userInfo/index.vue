<template>
  <div class="userInfo">
    <div>
      <div class="title"><span>用户信息</span></div>
      <div>
        <Table
          ref="table"
          style="margin-top: 20px"
          @now-page="handlePage"
          @now-size="handleSize"
          @table-sort="handleSort"
          :current-page="start"
          :page-size="limit"
          :total="total"
          :table-data="tableData"
          :header-data="tableHeader"
          :loading="loading"
        />
      </div>
    </div>
    <Dialog
      ref="authorization"
      title="权限修改"
      :visible.sync="authorization"
      width="700px"
      :close-on-click-modal="false"
      @submit="handleSave"
    >
      <el-select v-model="userInfo.level" placeholder="请选择">
        <el-option v-for="(item, key) in LevelList" :key="key" :label="item" :value="key">
        </el-option>
      </el-select>
    </Dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'
import Dialog from '@/components/Dialog'
import handleTable from '@/mixins/table.js'
import { getAllUserInfo, deleteUserInfo, getUserInfo, fixUserInfo } from '@/api'
export default {
  mixins: [handleTable],
  components: {
    Table,
    Dialog,
  },
  data() {
    return {
      show: false,
      authorization: false,
      LevelList: {},
      userInfo: {},
    }
  },
  methods: {
    handleSave() {
      fixUserInfo(this.userInfo).then((res) => {
        this.authorization = false
        this.getTableData()
      })
    },
    // 赋予权限
    handleAuthorization(row) {
      this.authorization = true
      this.userInfo = { ...row }
    },
    // 删除用户信息
    handleDelete(row) {
      console.log('2')
      this.$confirm(
        `该操作会将用户 <span class="text-danger">${row.username}</span>  删除，是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          deleteUserInfo(row.code).then((res) => {
            this.$message.success(res.message)
            this.getTableData()
          })
        })
        .catch(() => {})
    },
    getTableData() {
      this.loading = true
      this.getTableParams()
      getAllUserInfo(this.tableParams)
        .then((res) => {
          setTimeout(() => {
            this.loading = false
            this.tableData = res.result
            this.total = res.totalCount
          }, 500)
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
  created() {
    let data = { username: sessionStorage.getItem('username') }
    getUserInfo(data).then((res) => {
      this.userInfo = { ...res.userInfo }
    })
    this.LevelList = this.$store.state.levelList
    this.tableHeader = [
      {
        label: '用户名',
        prop: 'username',
        overflow: true,
        align: 'center',
        minWidth: 200,
      },
      {
        label: '真实姓名',
        prop: 'name',
        overflow: true,
        align: 'center',
        minWidth: 200,
      },
      {
        label: '性别',
        prop: 'sex',
        overflow: true,
        align: 'center',
        minWidth: 200,
      },
      {
        label: '年龄',
        prop: 'age',
        overflow: true,
        align: 'center',
        minWidth: 200,
      },
      {
        label: '用户权限',
        prop: 'level',
        overflow: true,
        align: 'center',
        minWidth: 200,
        formatter: (row) => {
          let LevelList = this.$store.state.levelList
          return LevelList[row.level]
        },
      },
      {
        label: '操作',
        align: 'center',
        minWidth: 160,
        buttonList: [
          {
            text: '赋予权限',
            type: 'text',
            event: (row) => {
              return this.handleAuthorization(row)
            },
            disabled(row) {
              return row.level === '5'
            },
          },
          {
            text: '删除',
            type: 'text',
            event: (row) => {
              return this.handleDelete(row)
            },
            disabled(row) {
              return row.level === '5'
            },
          },
        ],
      },
    ]
    this.getTableData()
  },
}
</script>

<style lang="less" scoped>
.userInfo {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
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
  .nolevel {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .nolevel_wrap {
      width: 50%;
      height: 50%;
    }
  }
}
.text-danger {
  color: red !important;
}
</style>
