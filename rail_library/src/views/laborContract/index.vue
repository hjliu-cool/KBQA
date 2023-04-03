<template>
  <div class="confidentialityAgreement">
    <div class="internship">
      <el-form :model="form" :rules="rules" ref="form" label-width="250px" class="ruleForm">
        <h1>劳动合同</h1>
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
            根据《中华人民共和国劳动法》及有关法律法规，经甲乙双方平等自愿协商一致，同意签订本合同，共同遵守本合同所列条款。
          </div>
          <div class="small_title">
            一、 劳动合同期限
          </div>
          <div>
            第一条 本合同为期限劳动合同，合同期自
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
            止。
          </div>
          <div class="indent">
            第二条 若乙方开始工作时间与约定时间不一致，以实际到岗之日为合同起始时间建立劳动关系。
          </div>
          <div class="small_title">
            二、 工作内容和工作地点
          </div>
          <div class="indent">
            第三条 根据甲方工作需要，乙方同意从事甲方岗位工作，乙方的工作地点为甲方的经营场所。
          </div>
          <div class="indent">
            第四条
            在合同有效期内，甲方根据公司业务需要及乙方的技能、工作业绩等，在与乙方充分协商的基础上，可以调整乙方的工作岗位、工作内容和工作地点。
          </div>
          <div class="indent">
            第五条
            在合同有效期内，甲方调整乙方的工作岗位、工作地点、工作内容时，不再与乙方另外签订劳动合同，只需在原订合同上进行相应的变更说明；乙方应履行新任岗位工作职责、工作内容和相关协议，待原订合同期满后，再按照新任岗位、工作地点签订合同。
          </div>
          <div class="small_title">
            三、 工作时间和休息休假
          </div>
          <div class="indent">
            第六条
            甲方依法制定员工工时、休息和休假制度；乙方须遵守甲方依法制定的工时、休息和休假制度，并按照规定上下班。
          </div>
          <div class="indent">
            第七条 乙方依法享有的婚丧假、女职工产假等，按照甲方依法制定的相关规章制度执行。
          </div>
          <div class="indent">
            第八条
            甲方因项目工作需要安排乙方延长工作时间或节假日加班加点的，乙方应服从甲方的统一安排；加班费用在项目提成里支付。
          </div>
          <div class="indent">
            第九条 乙方加班不能自行决定，须经上级安排或者按照程序报上级批准，否则不视为加班。
          </div>
          <div class="small_title">
            四、 劳动报酬
          </div>
          <div class="indent">
            第十条
            甲方根据法律、法规的规定，遵循按劳分配的原则，结合本公司实际和乙方的工作岗位，确定乙方的工资水平。
          </div>
          <div>
            第十一条 乙方月工资标准为
            <el-form-item label-width="0px" prop="contract_amount">
              <el-input
                v-model="form.contract_amount"
                :disabled="disabled"
                placeholder="请输入金额"
              >
              </el-input>
            </el-form-item>
            元，试用期满后的工资标准按甲方依法制定的薪酬管理办法执行，但甲方支付给乙方的工资不得低于当地政府公布的当年度最低工资标准。
          </div>
          <div class="indent">
            第十二条
            甲方有权根据其生产经营状况、乙方工作岗位的变更和依法制定的薪酬管理办法等公司制度调整乙方的工资待遇。
          </div>
          <div class="small_title">
            五、 社会保险和福利待遇
          </div>
          <div class="indent">
            第十三条 甲乙双方应执行国家有关社会保险和福利的规定。
          </div>
          <div class="indent">
            第十四条 乙方患病或非因工负伤，其病假工资和医疗待遇等按照甲方依法制定的相关制度执行。
          </div>
          <div class="indent">
            第十五条 乙方患职业病或因工负伤的待遇，按国家及本省有关规定执行。
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
        contract_name: '劳动合同',
        contract_type: '劳动合同',
        signing_date: '',
        first_party_name: '',
        first_party_name1: '',
        second_party_name: '',
        second_party_name1: '',
        contract_amount: '',
      },
      rules: {
        first_party_name: { required: true, message: '请输入用人单位名称', trigger: 'blur' },
        first_party_name1: { required: true, message: '请输入用人单位名称', trigger: 'blur' },
        second_party_name: { required: true, message: '请输入员工姓名', trigger: 'blur' },
        second_party_name1: { required: true, message: '请输入员工姓名', trigger: 'blur' },
        contract_amount: { required: true, message: '请输入金额', trigger: 'blur' },
        signing_date: { required: true, message: '请选则签订时间', trigger: 'blur' },
        start_date: { required: true, message: '请选则开始时间', trigger: 'blur' },
        end_date: { required: true, message: '请选结束时间', trigger: 'blur' },
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
            message: '起草劳动合同',
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
