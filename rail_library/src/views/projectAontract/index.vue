<template>
  <div class="confidentialityAgreement">
    <div class="internship">
      <el-form :model="form" :rules="rules" ref="form" label-width="250px" class="ruleForm">
        <div class="title">
          <el-form-item label-width="0px" prop="contract_name">
            <el-input
              v-model="form.contract_name"
              :disabled="disabled"
              placeholder="请输入项目名称"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="甲方(以下简称甲方)：" prop="first_party_name">
            <el-input
              v-model="form.first_party_name"
              :disabled="disabled"
              placeholder="请输入甲方单位名称"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="信用代码：" prop="first_party_id">
            <el-input
              v-model="form.first_party_id"
              maxlength="18"
              placeholder="请输入甲方信用代码"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="乙方(以下简称乙方)：" prop="second_party_name">
            <el-input
              v-model="form.second_party_name"
              :disabled="disabled"
              placeholder="请输入乙方单位名称"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="信用代码：" prop="second_party_id">
            <el-input
              v-model="form.second_party_id"
              maxlength="18"
              placeholder="请输入乙方信用代码"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </div>
        <div class="internshipInnerWrap">
          <div class="indent">
            甲乙双方本着公平、平等、互利的原则订立合作协议如下：
          </div>
          <div>
            一、甲乙双方自愿合作经营 项目，总投资为
            <el-form-item label-width="0px" prop="contract_amount">
              <el-input
                v-model="form.contract_amount"
                :disabled="disabled"
                placeholder="请输入金额"
              ></el-input>
            </el-form-item>
            万元，甲方以人民币方式出资万元，乙方以 方式入股。
          </div>
          <div class="indent">
            二、
            本合伙依法组成合伙企业，在合伙期间合伙人出资的为共有财产，不得随意分割。合伙终至后，各合伙人的出资仍为个人所有，届时予以返还。
          </div>
          <div class="indent">
            三、
            双方共同经营，合伙人执行合伙事务所产生的收益归全体合伙人，所产生的亏损或者民事责任由全体合伙人共同承担。
          </div>
          <div class="indent">
            四、 项目债务按照甲方50%、乙方50%比例负担。任何一方对外偿还债务后，另一方应按比例在
            内向对方清偿自己负担的部分。
          </div>
          <div class="indent">
            五、自协议签订之日起，乙方负责技术和项目现场有关事宜，甲方负责日常管理；与业主、监理方、设计单位的各种工作联系（包括协商、签证等）及日常事务。
          </div>
          <div class="indent">
            六、 争议处理
          </div>
          <div>
            1、对于执行本合同发生的与本合同有关的争议应本着友好协商的原则解决；<br />
            2、如果双方通过协商不能达成一致，则提交仲裁委员会进行仲裁，或依法向人民法院起诉；
          </div>
          <div class="indent">
            七、 违约处理
          </div>
          <div>
            如果一方违反本合同的任何条款，非违约方有权终止本合同的执行，并依法要求违约方赔偿损害。
          </div>
          <div class="indent">
            八、 协议解除
          </div>
          <div>
            1、 一方合伙人有违反本合协议的，另一方有权解除合作协议 <br />
            2、 合作协议期满 <br />
            3、 双方同意终止协优议的 <br />
            4、 一方合伙人出现法律上问题及做对企业有损害的，另一方有权解除合作协议
          </div>
          <div class="indent">
            九、 本合同一式两份，双方各执一份，具有相同的法律效力
          </div>
        </div>
        <div class="autograph">
          <div>
            <el-form-item label="甲方(签章)：" prop="first_party_name1">
              <el-input
                v-model="form.first_party_name1"
                :disabled="disabled"
                placeholder="请输入用人单位名称"
              >
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="乙方(签章)：" prop="second_party_name1">
              <el-input
                v-model="form.second_party_name1"
                :disabled="disabled"
                placeholder="请输入员工姓名"
              >
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="截止日期：" prop="end_date">
              <el-date-picker
                v-model="form.end_date"
                type="date"
                placeholder="选择日期"
                :disabled="disabled"
              ></el-date-picker>
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
        contract_name: '',
        contract_type: '项目合同',
        signing_date: '',
        first_party_name: '',
        first_party_name1: '',
        second_party_name: '',
        second_party_name1: '',
        contract_amount: '',
      },
      rules: {
        contract_name: { required: true, message: '请输入项目名称', trigger: 'blur' },
        first_party_id: { required: true, message: '请输入甲方信用代码', trigger: 'blur' },
        second_party_id: { required: true, message: '请输入乙方信用代码', trigger: 'blur' },
        first_party_name: { required: true, message: '请输入甲方单位名称', trigger: 'blur' },
        first_party_name1: { required: true, message: '请输入甲方单位名称', trigger: 'blur' },
        second_party_name: { required: true, message: '请输乙方单位名称', trigger: 'blur' },
        second_party_name1: { required: true, message: '请输乙方单位名称', trigger: 'blur' },
        contract_amount: { required: true, message: '请输入违约金额', trigger: 'blur' },
        signing_date: { required: true, message: '请选则签订时间', trigger: 'blur' },
        end_date: { required: true, message: '请选则签订时间', trigger: 'blur' },
      },
      disabled: false,
      contractDetails: false,
    }
  },
  methods: {
    // 起草合同
    saveContract() {
      this.$refs['form'].validate().then(() => {
        let signing_date = dateFormat(this.form.signing_date)
        this.form.signing_date = signing_date
        let end_date = dateFormat(this.form.end_date)
        this.form.end_date = end_date
        addContract_information(this.form).then((res) => {
          this.$message.success(res.message)
          this.form = {}
          let log = {
            time: dateFormat(new Date()),
            message: '起草项目合同',
            user: sessionStorage.getItem('username'),
          }
          addOperationLog(log).then((res) => {})
        })
      })
    },
    // 审批通过/拒绝
    handleApprove(val) {
      let signing_date = dateFormat(this.form.signing_date)
      this.form.signing_date = signing_date
      let end_date = dateFormat(this.form.end_date)
      this.form.end_date = end_date
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
        let signing_date = dateFormat(this.form.signing_date)
        this.form.signing_date = signing_date
        let end_date = dateFormat(this.form.end_date)
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
        let signing_date = dateFormat(this.form.signing_date)
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
.confidentialityAgreement {
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
    .title {
      text-align: center;
      margin-bottom: 50px;
    }
    .internshipInnerWrap {
      margin-top: 50px;
      .indent {
        text-indent: 2em;
        line-height: 30px;
        padding: 10px 0;
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
    padding: 0px;
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
