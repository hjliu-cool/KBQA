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
            <el-form-item label="合同状态：" prop="expire_status">
              <el-select v-model="searchForm.expire_status" placeholder="请选择">
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
          <el-col :span="8">
            <el-form-item label="到期时间：" prop="outTime">
              <el-select v-model="searchForm.outTime" placeholder="请选择">
                <el-option label="一个月" value="30"> </el-option>
                <el-option label="三个月" value="90"> </el-option>
                <el-option label="六个月" value="180"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-right">
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button type="warning" @click="handleReset">
              重置
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
      title="终止合同"
      :visible.sync="failed_reasonshow"
      width="700px"
      :close-on-click-modal="false"
      @submit="handleSubmit"
    >
      <div>终止原因：</div>
      <br />
      <el-input
        type="textarea"
        v-model.trim="change.expire_reason"
        placeholder="请输入终止原因"
        maxlength="50"
        clearable
      />
    </Dialog>
  </div>
</template>
<script>
import Dialog from '@/components/Dialog'
import Table from '@/components/Table'
import DatePicker from '@/components/DatePicker'
import handleTable from '@/mixins/table.js'
import { getAfterContractInformation, terminationContract, addOperationLog } from '@/api'
import { dateFormatTwo, dateFormat } from '@/utils'
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
        approved_status: 1,
        expire_status: '',
        approved_by: '',
        beginCreateDate: '',
        endCreateDate: '',
        outTime: '',
      },
      change: {
        expire_reason: '',
        contract_number: '',
      },
      failed_reasonshow: false,
      options: [
        {
          value: 1,
          label: '合同正常生效中',
        },
        {
          value: 2,
          label: '有效期时间截止',
        },
        {
          value: 3,
          label: '人为性异常终止',
        },
      ],
    }
  },
  methods: {
    handlePicker(date) {
      if (date) {
        this.searchForm.beginCreateDate = date[0] + ' 00:00:00'
        this.searchForm.endCreateDate = date[1] + ' 23:59:59'
      }
    },
    getTableData() {
      this.loading = true
      this.getTableParams()
      this.tableParams.timeOut = 1
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
        approved_status: 1,
        approved_by: '',
        beginCreateDate: '',
        endCreateDate: '',
        expire_status: '',
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
      this.change = {
        expire_reason: row.expire_reason,
        contract_number: row.contract_number,
        expire_status: 3,
      }
    },
    handleSubmit() {
      if (this.change.expire_reason === '') {
        this.$message.warning('请输入终止原因')
        return
      }
      this.$confirm('此操作将永久终止合同,并不可回退, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = { ...this.change }
        data.expire_status = 3
        terminationContract(data).then((res) => {
          let log = {
            time: dateFormat(new Date()),
            message: `终止合同${this.change.contract_number}`,
            user: sessionStorage.getItem('username'),
          }
          addOperationLog(log).then((res) => {})
          this.$message.success(res.message)
          this.failed_reasonshow = false
          this.change = {
            expire_reason: '',
            contract_number: '',
            expire_status: 3,
          }

          this.getTableData()
        })
      })
    },
  },
  created() {
    this.tableHeader = [
      {
        label: '合同名称',
        prop: 'contract_name',
        overflow: true,
        align: 'center',
        minWhith: 200,
      },
      {
        label: '合同编号',
        prop: 'contract_number',
        overflow: true,
        align: 'center',
        minWidth: 150,
      },

      {
        label: '开始日期',
        prop: 'start_date',
        overflow: true,
        align: 'center',
        minWidth: 120,
        sortable: 'custom',
        formatter: (row) => {
          if (row.start_date === '2099-01-01T00:00:00.000Z') {
            return '-'
          } else {
            return dateFormatTwo(row.start_date)
          }
        },
      },
      {
        label: '结束日期',
        prop: 'end_date',
        overflow: true,
        align: 'center',
        minWidth: 120,
        sortable: 'custom',
        formatter: (row) => {
          if (row.end_date === null) {
            return '-'
          } else {
            return dateFormatTwo(row.end_date)
          }
        },
      },
      {
        label: '合同状态',
        prop: 'expire_status',
        overflow: true,
        align: 'center',
        minWidth: 180,
        render(h, row) {
          let res
          row.expire_status === 1
            ? (res = <el-tag type="success">合同正常生效中</el-tag>)
            : row.expire_status === 2
            ? (res = <el-tag type="warning">有效期时间截止</el-tag>)
            : (res = <el-tag type="danger">人为性异常终止</el-tag>)
          return res
        },
      },
      {
        label: '原因',
        prop: 'expire_reason',
        overflow: true,
        align: 'center',
        minWidth: 200,
        formatter: (row) => {
          return row.expire_reason || '-'
        },
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
            text: '终止合同',
            type: 'text',
            event: (row) => {
              return this.handleFailed(row)
            },
            disabled(row) {
              return row.expire_status !== 1
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
