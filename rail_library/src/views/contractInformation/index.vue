<template>
  <div>
    <div class="contractInformation">
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-width="130px"
        @keyup.enter.native="handleSearch"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="合同名称：" prop="contract_name">
              <el-input
                v-model.trim="searchForm.contract_name"
                placeholder="请输入合同名称"
                maxlength="15"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号：" prop="contract_number">
              <el-input
                v-model.trim="searchForm.contract_number"
                placeholder="请输入合同编号"
                maxlength="15"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批状态：" prop="approved_status">
              <el-select v-model="searchForm.approved_status" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="审批人：" prop="approved_by">
              <el-input
                v-model.trim="searchForm.approved_by"
                placeholder="请输入审批人"
                maxlength="15"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批时间：">
              <DatePicker style="width: 100%;" @getDateVal="handlePicker" date-type="daterange" />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="text-right">
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button type="warning" @click="handleReset">
              重置
            </el-button>
            <el-button type="success" @click="handDownload">
              下载
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="contractInformation" style="margin-top:20px">
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
    <Dialog
      ref="failed_reasonshow"
      title="原因"
      :visible.sync="failed_reasonshow"
      width="700px"
      :close-on-click-modal="false"
      :showSubmit="false"
      cancelText="确定"
    >
      <span> 拒绝原因：</span><span>{{ this.failed_reason }}</span>
    </Dialog>
  </div>
</template>
<script>
import Dialog from '@/components/Dialog'
import Table from '@/components/Table'
import DatePicker from '@/components/DatePicker'
import handleTable from '@/mixins/table.js'
import { getAfterContractInformation, getSqlDownload, addOperationLog } from '@/api'
import { dateFormat } from '@/utils'
export default {
  mixins: [handleTable],
  components: {
    Table,
    DatePicker,
    Dialog,
  },
  data() {
    return {
      searchForm: {
        contract_name: '',
        contract_number: '',
        approved_status: '',
        approved_by: '',
        beginCreateDate: '',
        endCreateDate: '',
      },
      failed_reason: '',
      failed_reasonshow: false,
      options: [
        {
          value: 1,
          label: '审批通过',
        },
        {
          value: 2,
          label: '审批未通过',
        },
      ],
    }
  },
  methods: {
    handDownload() {
      this.getTableParams()
      getSqlDownload(this.tableParams).then((res) => {
        let log = {
          time: dateFormat(new Date()),
          message: '下载合同信息',
          user: sessionStorage.getItem('username'),
        }
        addOperationLog(log).then((res) => {})
        let url = URL.createObjectURL(res)
        let a = document.createElement('a')
        a.href = url
        document.body.appendChild(a)
        let time = new Date()
        a.download = `tableData_${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      })
    },
    handlePicker(date) {
      if (date) {
        this.searchForm.beginCreateDate = date[0] + ' 00:00:00'
        this.searchForm.endCreateDate = date[1] + ' 23:59:59'
      }
    },
    getTableData() {
      this.loading = true
      this.getTableParams()
      getAfterContractInformation(this.tableParams)
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
    handleReset() {
      this.searchForm = {
        contract_name: '',
        contract_number: '',
        approved_status: '',
        approved_by: '',
        beginCreateDate: '',
        endCreateDate: '',
      }
      this.start = 1
      this.limit = 10
      this.$refs['searchForm'].resetFields()
      this.getTableData()
    },
    handleApproval(row) {
      switch (row.contract_type) {
        case '实习合同':
          this.$router.push(
            `/internship?contract_number=${row.contract_number}&approved_status=${row.approved_status}`
          )
          break
        case '保密协议':
          this.$router.push(
            `/secrecy?contract_number=${row.contract_number}&approved_status=${row.approved_status}`
          )
          break
        case '劳动合同':
          this.$router.push(
            `/labour?contract_number=${row.contract_number}&approved_status=${row.approved_status}`
          )
          break
        case '项目合同':
          this.$router.push(
            `/project?contract_number=${row.contract_number}&approved_status=${row.approved_status}`
          )
          break
        case '自定义合同':
          this.$router.push(
            `/richtext?contract_number=${row.contract_number}&approved_status=${row.approved_status}`
          )
          break
        default:
          return
      }
    },
    handleFailed(row) {
      this.failed_reasonshow = true
      this.failed_reason = row.failed_reason
    },
  },
  created() {
    this.tableHeader = [
      {
        label: '合同名称',
        prop: 'contract_name',
        overflow: true,
        align: 'center',
        minWidth: 150,
      },
      {
        label: '合同编号',
        prop: 'contract_number',
        overflow: true,
        align: 'center',
        minWidth: 150,
      },
      {
        label: '合同类型',
        prop: 'contract_type',
        overflow: true,
        align: 'center',
        minWidth: 150,
      },
      {
        label: '审批时间',
        prop: 'approved_time',
        overflow: true,
        align: 'center',
        minWidth: 150,
        sortable: 'custom',
        formatter: (row) => {
          return dateFormat(row.approved_time)
          console.log(row.approved_time)
        },
      },
      {
        label: '审批状态',
        prop: 'approved_status',
        overflow: true,
        align: 'center',
        minWidth: 150,
        render(h, row) {
          let res
          row.approved_status === 1
            ? (res = <el-tag type="success">通过</el-tag>)
            : (res = <el-tag type="danger">拒绝</el-tag>)
          return res
        },
      },
      {
        label: '审批人',
        prop: 'approved_by',
        overflow: true,
        align: 'center',
        minWidth: 150,
      },
      {
        label: '操作',
        align: 'center',
        minWidth: 160,
        buttonList: [
          {
            text: '查看详情',
            type: 'text',
            event: (row) => {
              return this.handleApproval(row)
            },
          },
          {
            text: '拒绝原因',
            type: 'text',
            event: (row) => {
              return this.handleFailed(row)
            },
            visible(row) {
              return row.approved_status === 2
            },
          },
        ],
      },
    ]
    this.getTableData()
  },
}
</script>
<style lang="less" scope>
.contractInformation {
  background: #fff;
  padding: 20px;
}
.text-right {
  text-align: right;
}
.el-select {
  width: 100%;
}
</style>
