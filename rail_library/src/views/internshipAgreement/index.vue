<template>
  <div class="internshipAgreement">
    <div class="internship">
      <el-form :model="form" :rules="rules" ref="form" label-width="200px" class="ruleForm">
        <h1>实习协议</h1>
        <div>
          <el-form-item label="甲方(实习单位)：" prop="first_party_name">
            <el-input
              v-model="form.first_party_name"
              :disabled="disabled"
              placeholder="请输入实习单位"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="乙方(实习人员)：" prop="second_party_name">
            <el-input
              v-model="form.second_party_name"
              :disabled="disabled"
              placeholder="请输入实习人员"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="身份证号：" prop="second_party_id">
            <el-input
              v-model="form.second_party_id"
              maxlength="18"
              placeholder="请输入身份证号"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="联系电话：" prop="second_party_phone">
            <el-input
              v-model="form.second_party_phone"
              maxlength="11"
              placeholder="请输入手机号"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </div>
        <div class="internshipInnerWrap">
          <div class="internshipInner">
            根据实习人员（以下简称乙方）个人意愿，本着提高乙方的社会实践技能。促进就业，经乙方个人自愿申请，实习单位（以下简称甲方）同意接受乙方在企业进行实习。为明确甲乙双方的责任与义务，根据国家有关法律法规，本着平等自愿的原则，经甲乙双方协商一致，签订本实习协议，双方约定如下：
          </div>
          <div class="internship_title">
            一、实习期限
          </div>
          <div>
            <span class="suojin">乙方在甲方实习期自 </span>
            <el-form-item label-width="0px" prop="start_date">
              <el-date-picker
                v-model="form.start_date"
                type="date"
                placeholder="选择日期"
                :disabled="disabled"
              ></el-date-picker>
            </el-form-item>
            <span> 起，至 </span>
            <el-form-item label-width="0px" prop="end_date">
              <el-date-picker
                v-model="form.end_date"
                type="date"
                placeholder="选择日期"
                :disabled="disabled"
              ></el-date-picker>
            </el-form-item>
            <p>结束。</p>
          </div>
          <div class="internship_title">
            二、实习岗位
          </div>
          <span class="suojin">甲方根据乙方的实际情况和企业工作需要，安排乙方相应岗位实习。</span>
          <div class="internship_title">
            三、实习津贴
          </div>
          <div>
            <span class="span">
              甲方按照企业现行规章制度以及乙方在实习期间的具体实习情况，予以发放实习津贴
            </span>
            <el-form-item label-width="0px" prop="contract_amount">
              <el-input
                v-model="form.contract_amount"
                :disabled="disabled"
                placeholder="请输入金额"
              >
              </el-input>
            </el-form-item>
            <span> 元/月。甲方为乙方加纳以外险。</span>
          </div>
        </div>
        <div class="autograph">
          <div>
            <el-form-item label="甲方(实习单位)：" prop="first_party_name1">
              <el-input
                v-model="form.first_party_name1"
                :disabled="disabled"
                placeholder="请输入实习单位"
              >
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="乙方(实习人员)：" prop="second_party_name1">
              <el-input
                v-model="form.second_party_name1"
                :disabled="disabled"
                placeholder="请输入实习人员"
              >
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="签订日期：" prop="signing_date">
              <el-date-picker
                v-model="form.signing_date"
                type="date"
                placeholder="选择日期"
                :disabled="disabled"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="btn" v-if="!disabled && !change">
          <el-button type="primary" @click="saveContract">起草合同</el-button>
        </div>
        <div class="btn" v-else-if="!change">
          <el-button type="primary" @click="handleApprove(true)">通过</el-button>
          <el-button type="info" @click="contractDetails = true">拒绝</el-button>
          <el-button type="warning" @click="handleBack">返回</el-button>
        </div>
        <div class="btn" v-else-if="change">
          <el-button type="primary" @click="handleChange">保存</el-button>
          <el-button type="warning" @click="handleBack">返回</el-button>
        </div>
      </el-form>
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
  </div>
</template>

<script>
import {
  addContract_information,
  getContract_information,
  contract_after_approval,
  contract_await_approval,
  addOperationLog,
} from '@/api'
import { dateFormat } from '@/utils'
import Dialog from '@/components/Dialog'
export default {
  components: {
    Dialog,
  },
  data() {
    return {
      change: false,
      form: {
        contract_name: '实习合同',
        contract_type: '实习合同',
        signing_date: '',
        start_date: '',
        end_date: '',
        first_party_name: '',
        first_party_name1: '',
        second_party_phone: '',
        second_party_name: '',
        second_party_name1: '',
        second_party_id: '',
        contract_amount: '',
      },
      rules: {
        first_party_name: { required: true, message: '请输入实习单位', trigger: 'blur' },
        first_party_name1: { required: true, message: '请输入实习单位', trigger: 'blur' },
        second_party_name: { required: true, message: '请输入实习人员', trigger: 'blur' },
        second_party_name1: { required: true, message: '请输入实习人员', trigger: 'blur' },
        contract_amount: { required: true, message: '请输入金额', trigger: 'blur' },
        signing_date: { required: true, message: '请选则签订时间', trigger: 'blur' },
        start_date: { required: true, message: '请选则起始时间', trigger: 'blur' },
        end_date: { required: true, message: '请选则结束时间', trigger: 'blur' },
        second_party_id: { required: true, message: '请输入身份证号', trigger: 'blur' },
        second_party_phone: { required: true, message: '请输入手机号', trigger: 'blur' },
      },
      disabled: false,
      contractDetails: false,
    }
  },
  methods: {
    // 起草合同
    saveContract() {
      this.$refs['form'].validate().then(() => {
        let end_date = dateFormat(this.form.end_date)
        let start_date = dateFormat(this.form.start_date)
        let signing_date = dateFormat(this.form.signing_date)
        this.form.end_date = end_date
        this.form.start_date = start_date
        this.form.signing_date = signing_date
        addContract_information(this.form).then((res) => {
          this.$message.success(res.message)
          this.form = {}
          let log = {
            time: dateFormat(new Date()),
            message: '起草实习合同',
            user: sessionStorage.getItem('username'),
          }
          addOperationLog(log).then((res) => {})
        })
      })
    },
    // 审批通过/拒绝
    handleApprove(val) {
      let end_date = dateFormat(this.form.end_date)
      let start_date = dateFormat(this.form.start_date)
      let signing_date = dateFormat(this.form.signing_date)
      this.form.end_date = end_date
      this.form.start_date = start_date
      this.form.signing_date = signing_date
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
      this.$refs['form'].validate().then(() => {
        let end_date = dateFormat(this.form.end_date)
        let start_date = dateFormat(this.form.start_date)
        let signing_date = dateFormat(this.form.signing_date)
        this.form.end_date = end_date
        this.form.start_date = start_date
        this.form.signing_date = signing_date
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
      getContract_information(data).then((res) => {
        this.form = {
          ...res.result[0],
          first_party_name1: res.result[0].first_party_name,
          second_party_name1: res.result[0].second_party_name,
        }
        let end_date = dateFormat(this.form.end_date)
        let start_date = dateFormat(this.form.start_date)
        let signing_date = dateFormat(this.form.signing_date)
        this.form.end_date = end_date.replace('00:00:00', '')
        this.form.start_date = start_date.replace('00:00:00', '')
        this.form.signing_date = signing_date.replace('00:00:00', '')
        this.change = this.$route.query.change === 'true'
        this.change ? (this.disabled = false) : (this.disabled = true)
      })
    }
    this.change = this.$route.query.change === 'true'
  },
}
</script>

<style lang="less">
.internshipAgreement {
  width: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  .internship {
    width: 70%;
    padding: 0 40px;
    box-sizing: border-box;
    font-size: 20px;
    h1 {
      line-height: 50px;
      font-size: 30px;
      text-align: center;
      margin-bottom: 80px;
    }
    .internshipInnerWrap {
      .internship_title {
        font-weight: 800;
        padding: 10px 0;
      }
      .internshipInner {
        clear: both;
        text-indent: 2em;
        margin-top: 50px;
        line-height: 40px;
        font-size: 20px;
      }
      .suojin {
        display: inline-block;
        line-height: 40px;
        text-indent: 2em;
      }
      .span {
        text-indent: 2em;
        line-height: 40px;
      }
    }
    .autograph {
      margin-top: 20px;
      float: right;
      text-align: right;
    }
    .btn {
      text-align: center;
      padding: 50px 0;
      clear: both;
    }
  }
  .el-input {
    width: 200px;
  }
  .el-form-item {
    display: inline-block;
    padding: 0px !important;
  }

  .el-form-item__label {
    font-size: 20px !important;
    color: #000 !important;
  }
}
</style>
