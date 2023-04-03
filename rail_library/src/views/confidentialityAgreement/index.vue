<template>
  <div class="confidentialityAgreement">
    <div class="internship">
      <el-form :model="form" :rules="rules" ref="form" label-width="250px" class="ruleForm">
        <h1>保密协议</h1>
        <div>
          <el-form-item label="甲方(用人单位名称)：" prop="first_party_name">
            <el-input
              v-model="form.first_party_name"
              :disabled="disabled"
              placeholder="请输入用人单位名称"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="乙方(员工姓名)：" prop="second_party_name">
            <el-input
              v-model="form.second_party_name"
              :disabled="disabled"
              placeholder="请输入员工姓名"
            ></el-input>
          </el-form-item>
        </div>
        <div class="internshipInnerWrap">
          <div class="indent">
            乙方在甲方任职期间及离职后的一定期间，均会接触或掌握甲方的商业秘密，为了维护甲、乙双方的合法权益，现就有关保密事项协议如下：
          </div>
          <div class="indent">
            一、甲方的商业秘密，是指不为公众所知悉、能为权利人带来经济利益、具有实用性并经甲方采取保密措施的技术信息和经营信息。包括但不限于：设计、程序、操作等方面的软件，产品方案，产品策略，制作方法，客户名单，货源及技术情报，财务资料，供应商、经销商资料，以及乙方依约或依法对第三方负有保密责任的第三方的商业秘密等信息。
          </div>
          <div class="indent">
            二、甲方在乙方任职期间，应为其提供工作所必需的各种信息、资料、设备和软件，以充分发挥其聪明才智。
          </div>
          <div class="indent">
            三、甲方应制定相应的保密制度，对商业秘密的内容、范围、保密期限等作出规定，以便乙方遵循。
          </div>
          <div class="indent">
            四、乙方同意采取必要及有效的措施，维护其于受雇期间所知悉或持有的商业机密。除职务上的正常、合理使用外，非经甲方书面同意，不得将甲方的商业秘密泄露、告知、交付或转移给甲方(包括甲方之关系企业)以外的第三方，或为自己或第三方使用。
          </div>
          <div class="indent">
            五、乙方在甲方任职期间，保证不私自保留、复制和泄露任何商业秘密资料，不在其他公司兼职;保证不私自从外部将任何有侵权可能的信息和资料携人甲方，并擅自使用，否则，乙方愿承担由此产生的一切法律和经济责任。乙方离职后1年内，保证不在甲方以外的任何场所使用甲方的商业秘密与甲方竞争;甲方为此支付乙方保密费用元。
          </div>
          <div class="indent">
            六、乙方离职时，应立即将自己所持有的甲方所有的商业秘密资料、软件等物品移交甲方所指定的人员，并办妥相关手续。
          </div>
          <div>
            七、甲、乙双方均愿严格执行本协议。任何一方违约，应向对方支付违约金
            <el-form-item label-width="0px" prop="contract_amount">
              <el-input
                v-model="form.contract_amount"
                :disabled="disabled"
                placeholder="请输入金额"
              >
              </el-input>
            </el-form-item>
            元;给对方造成经济损失的，愿承担全部赔偿责任。此外，乙方违约的，甲方可以解除其劳动合同。
          </div>
          <div class="indent">
            八、本协议为劳动合同的附件，一式两份，甲乙双方各执一份。
          </div>
        </div>
        <div class="autograph">
          <div>
            <el-form-item label="甲方(用人单位名称)：" prop="first_party_name1">
              <el-input
                v-model="form.first_party_name1"
                :disabled="disabled"
                placeholder="请输入用人单位名称"
              >
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="乙方(员工姓名)：" prop="second_party_name1">
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
        contract_name: '保密协议',
        contract_type: '保密协议',
        signing_date: '',
        first_party_name: '',
        first_party_name1: '',
        second_party_name: '',
        second_party_name1: '',
        contract_amount: '',
        end_date: '',
      },
      rules: {
        first_party_name: { required: true, message: '请输入用人单位名称', trigger: 'blur' },
        first_party_name1: { required: true, message: '请输入用人单位名称', trigger: 'blur' },
        second_party_name: { required: true, message: '请输入员工姓名', trigger: 'blur' },
        second_party_name1: { required: true, message: '请输入员工姓名', trigger: 'blur' },
        contract_amount: { required: true, message: '请输入违约金额', trigger: 'blur' },
        signing_date: { required: true, message: '请选则签订时间', trigger: 'blur' },
        end_date: { required: true, message: '请选则截止时间', trigger: 'blur' },
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
        let end_date = dateFormat(this.form.end_date)
        this.form.signing_date = signing_date
        this.form.end_date = end_date
        addContract_information(this.form).then((res) => {
          this.$message.success(res.message)
          this.form = {}
          let log = {
            time: dateFormat(new Date()),
            message: '起草保密协议',
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
    h1 {
      line-height: 50px;
      font-size: 30px;
      text-align: center;
      margin-bottom: 80px;
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
