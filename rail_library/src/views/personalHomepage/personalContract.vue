<template>
  <div>
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
import { getContractOfUser } from '@/api'
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
      searchForm: {},
      failed_reasonshow: false,
      failed_reason: '',
    }
  },
  methods: {
    handleFailed(row) {
      this.failed_reasonshow = true
      this.failed_reason = row.failed_reason
    },
    getTableData() {
      this.loading = true
      this.getTableParams()
      ;(this.tableParams.username = sessionStorage.getItem('username')),
        getContractOfUser(this.tableParams)
          .then((res) => {
            setTimeout(() => {
              this.loading = false
              this.tableData = res.result.res
            }, 500)
          })
          .catch(() => {
            this.loading = false
          })
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
        default:
          return
      }
    },
  },
  created() {
    this.tableHeader = [
      {
        label: '合同名称',
        prop: 'contract_name',
        overflow: true,
        align: 'center',
        whith: 200,
      },
      {
        label: '合同编号',
        prop: 'contract_number',
        overflow: true,
        align: 'center',
        minWidth: 200,
      },
      {
        label: '审批时间',
        prop: 'approved_time',
        overflow: true,
        align: 'center',
        minWidth: 200,
        formatter: (row) => {
          if (row.approved_time) {
            return dateFormat(row.approved_time)
          } else {
            return '-'
          }
        },
      },
      {
        label: '甲方',
        prop: 'first_party_name',
        overflow: true,
        align: 'center',
        minWidth: 200,
      },
      {
        label: '乙方',
        prop: 'second_party_name',
        overflow: true,
        align: 'center',
        minWidth: 200,
      },
      {
        label: '审批状态',
        prop: 'default_amount	',
        overflow: true,
        align: 'center',
        minWidth: 200,
        render(h, row) {
          if (row.approved_status === 0) {
            return <el-tag type="danger">待审批</el-tag>
          } else if (row.approved_status === 1) {
            return <el-tag type="success">审批通过</el-tag>
          } else {
            return <el-tag type="error">审批拒绝</el-tag>
          }
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
<style lang="less">
.contractInformation {
  background: #fff;
  padding: 20px;
}
.text-right {
  text-align: right;
}
</style>
