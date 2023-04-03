<template>
  <div>
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
              <el-form-item label="合同类型：" prop="contract_type">
                <el-select v-model="searchForm.contract_type" placeholder="请选择">
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
              <el-form-item label="开始时间：">
                <DatePicker style="width: 100%;" @getDateVal="handlePicker" date-type="daterange" />
              </el-form-item>
            </el-col>
            <el-col :span="16" class="text-right">
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
    </div>
  </div>
</template>
<script>
import Table from '@/components/Table'
import DatePicker from '@/components/DatePicker'
import handleTable from '@/mixins/table.js'
import { getContract_information } from '@/api'
import { dateFormat } from '@/utils'

export default {
  mixins: [handleTable],
  components: {
    Table,
    DatePicker,
  },
  data() {
    return {
      searchForm: {
        contract_name: '',
        contract_number: '',
        contract_type: '',
        beginCreateDate: '',
        endCreateDate: '',
      },
      options: [
        {
          value: '实习合同',
          label: '实习合同',
        },
        {
          value: '保密协议',
          label: '保密协议',
        },
        {
          value: '劳动合同',
          label: '劳动合同',
        },
        {
          value: '项目合同',
          label: '项目合同',
        },
        {
          value: '自定义合同',
          label: '自定义合同',
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
      getContract_information(this.tableParams)
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
        contract_type: '',
        beginCreateDate: '',
        endCreateDate: '',
      }
      this.start = 1
      this.limit = 10
      this.$refs['searchForm'].resetFields()
      this.getTableData()
    },
    handleApproval(row, change) {
      switch (row.contract_type) {
        case '实习合同':
          this.$router.push(
            `/internshipAgreement?contract_number=${row.contract_number}&change=${change}`
          )
          break
        case '保密协议':
          this.$router.push(
            `/confidentialityAgreement?contract_number=${row.contract_number}&change=${change}`
          )
          break
        case '劳动合同':
          this.$router.push(
            `/laborContract?contract_number=${row.contract_number}&change=${change}`
          )
          break
        case '项目合同':
          this.$router.push(
            `/projectAontract?contract_number=${row.contract_number}&change=${change}`
          )
          break
        case '自定义合同':
          this.$router.push(
            `/richTextEditor?contract_number=${row.contract_number}&change=${change}`
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
        minWidth: 120,
      },
      {
        label: '甲方',
        prop: 'first_party_name',
        overflow: true,
        align: 'center',
        minWidth: 150,
        formatter: (row) => {
          return row.first_party_name === '' ? '-' : row.first_party_name
        },
      },
      {
        label: '乙方',
        prop: 'second_party_name',
        overflow: true,
        align: 'center',
        minWidth: 150,
        formatter: (row) => {
          return row.second_party_name === '' ? '-' : row.second_party_name
        },
      },
      {
        label: '签订时间',
        prop: 'signing_date',
        overflow: true,
        align: 'center',
        minWidth: 200,
        formatter: (row) => {
          return dateFormat(row.signing_date).replace('00:00:00', '')
        },
      },
      {
        label: '审批状态',
        prop: 'default_amount',
        overflow: true,
        align: 'center',
        minWidth: 200,
        render(h, row) {
          return <el-tag type="danger">待审批</el-tag>
        },
      },
      {
        label: '操作',
        align: 'center',
        minWidth: 160,
        buttonList: [
          {
            text: '审批',
            type: 'text',
            event: (row) => {
              return this.handleApproval(row, false)
            },
            visible() {
              let level = sessionStorage.getItem('level')
              let res = false
              if (level === '4' || level === '5') {
                res = true
              }
              return res
            },
          },
          {
            text: '修改',
            type: 'text',
            event: (row) => {
              return this.handleApproval(row, true)
            },
            visible() {
              let level = sessionStorage.getItem('level')
              let res = false
              if (level === '3' || level === '5') {
                res = true
              }
              return res
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
.el-select {
  width: 100%;
}
</style>
