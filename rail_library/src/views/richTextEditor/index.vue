<template>
  <div class="rich-text-editor">
    <div class="title">
      合同名称:
      <el-input
        v-model="form.contract_name"
        placeholder="请输入合同名称"
        maxlength="50"
        clearable
        :disabled="disabled"
      ></el-input>
    </div>
    <RichTextEditor
      v-model="form"
      :showInput="showInput"
      :showContent="!showInput"
    ></RichTextEditor>
    <div class="btnSubmit">
      <div class="btn" v-if="showInput && !disabled && !change">
        <el-button type="primary" @click="saveContract">起草合同</el-button>
      </div>
      <div class="btn" v-if="!showInput && disabled">
        <el-button type="primary" @click="handleApprove(true)">通过</el-button>
        <el-button type="info" @click="contractDetails = true">拒绝</el-button>
        <el-button type="warning" @click="handleBack">返回</el-button>
      </div>
      <div class="btn" v-if="showInput && !disabled && change">
        <el-button type="primary" @click="handleChange">保存</el-button>
        <el-button type="warning" @click="handleBack">返回</el-button>
      </div>
    </div>
    <Dialog
      ref="contractDetails"
      title="原因"
      :visible.sync="contractDetails"
      width="700px"
      :close-on-click-modal="false"
      @submit="handleApprove(false)"
    >
      <el-input v-model="form.failed_reason" placeholder="请输入原因"></el-input>
    </Dialog>
  </div>
</template>
<script>
import RichTextEditor from '@/components/RichTextEditor.vue'
import {
  addContract_information,
  addOperationLog,
  contract_after_approval,
  contract_await_approval,
  getContract_information,
} from '@/api'
import { dateFormat } from '@/utils'
import Dialog from '@/components/Dialog'
export default {
  components: {
    RichTextEditor,
    Dialog,
  },
  data() {
    return {
      contract_name: '',
      form: {
        contract_name: '',
        content: '',
        contract_type: '自定义合同',
        signing_date: '',
      },
      contractDetails: false,
      showInput: false,
      disabled: false,
      change: false,
    }
  },
  methods: {
    // 起草合同
    saveContract() {
      if (!this.form.contract_name) {
        this.$message.warning('请输入合同名称！')
        return
      }
      this.form.signing_date = dateFormat(new Date())
      this.form.end_date = dateFormat(new Date('2099'))
      addContract_information(this.form).then((res) => {
        this.$message.success(res.message)
        this.form = {}
        let log = {
          time: dateFormat(new Date()),
          message: '起草自定义合同',
          user: sessionStorage.getItem('username'),
        }
        addOperationLog(log).then((res) => {})
      })
    },
    // 审批通过/拒绝
    handleApprove(val) {
      let signing_date = dateFormat(this.form.signing_date)
      let end_date = dateFormat(this.form.end_date)
      this.form.signing_date = signing_date
      this.form.end_date = end_date
      this.form.start_date = signing_date
      let data = {
        ...this.form,
        approved_by: sessionStorage.getItem('username'),
        approved_status: val ? 1 : 2,
        approved_time: dateFormat(Date()),
      }
      contract_after_approval(data).then(() => {
        this.$message.success('操作成功')
        let log = {
          time: dateFormat(new Date()),
          message: `合同${data.contract_number}审批${data.approved_status ? '通过' : '未通过'}`,
          user: sessionStorage.getItem('username'),
        }
        addOperationLog(log).then((res) => {})
        this.$router.push('/contractApproval')
      })
    },
    // 返回
    handleBack() {
      this.$router.push('/contractApproval')
    },
    // 修改
    handleChange() {
      let signing_date = dateFormat(this.form.signing_date)
      let end_date = dateFormat(this.form.end_date)
      this.form.signing_date = signing_date
      this.form.end_date = end_date
      let data = {
        ...this.form,
      }
      contract_await_approval(data).then((res) => {
        this.$message.success(res.message)
        let log = {
          time: dateFormat(new Date()),
          message: `修改待审批合同${data.contract_number}`,
          user: sessionStorage.getItem('username'),
        }
        addOperationLog(log).then((res) => {})
        this.$router.push('/contractApproval')
      })
    },
  },
  created() {
    let data = {
      start: 0,
      limit: 10,
      contract_number: this.$route.query.contract_number,
    }
    if (data.contract_number) {
      // 审批或修改
      getContract_information(data).then((res) => {
        this.form = {
          ...res.result[0],
        }
        this.change = this.$route.query.change === 'true'
        if (this.change) {
          // 修改
          this.showInput = true
          this.disabled = false
        } else {
          // 审批
          this.showInput = false
          this.disabled = true
        }
      })
    } else {
      // 起草合同
      this.showInput = true
      this.disabled = false
      this.change = false
    }
  },
}
</script>
<style lang="less">
.rich-text-editor {
  padding: 20px;
  background: #fff;
  .title {
    margin-bottom: 20px;
  }
  .el-input {
    width: 200px;
  }
  .btnSubmit {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
