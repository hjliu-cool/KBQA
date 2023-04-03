<template>
  <div class="confidentialityAgreement">
    <div class="internship">
      <el-form :model="form" ref="form" label-width="250px" class="ruleForm">
        <div class="bill" ref="bill">
          <div class="title">
            <el-form-item label-width="0px" prop="contract_name">
              {{ form.contract_name }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="甲方(以下简称甲方)：" prop="first_party_name">
              {{ form.first_party_name }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="信用代码：" prop="first_party_id">
              {{ form.first_party_id }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="乙方(以下简称乙方)：" prop="second_party_name">
              {{ form.second_party_name }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="信用代码：" prop="second_party_id">
              {{ form.second_party_id }}
            </el-form-item>
          </div>
          <div class="internshipInnerWrap">
            <div class="indent">
              甲乙双方本着公平、平等、互利的原则订立合作协议如下：
            </div>
            <div>
              一、甲乙双方自愿合作经营 项目，总投资为
              <el-form-item label-width="0px" prop="contract_amount">
                {{ form.contract_amount }}
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
                {{ form.first_party_name1 }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="乙方(签章)：" prop="second_party_name1">
                {{ form.second_party_name1 }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="截止日期：" prop="end_date">
                {{ form.end_date }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="签订日期：" prop="signing_date">
                {{ form.signing_date }}
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="btn" v-if="approved_status">
          <el-button type="primary">
            <a :href="canvasImageUrl" download="contractImg.jpg">下载合同</a>
          </el-button>
          <el-button type="warning" @click="handleBack">返回</el-button>
          <img src="../../assets/approval.png" alt="" />
        </div>
        <div class="btn" v-else>
          <el-button type="warning" @click="handleBack">返回</el-button>
          <img src="../../assets/notapproval.png" alt="" />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { getAfterContractInformation } from '@/api'
import { dateFormat, dateFormatTwo } from '@/utils'
export default {
  data() {
    return {
      form: {},
      canvasImageUrl: '',
      approved_status: true,
    }
  },
  methods: {
    // 返回
    handleBack() {
      // this.$router.push('/contractInformation')
      window.history.back()
    },
    htmlToCanvas() {
      html2canvas(this.$refs.bill, {
        useCORS: true, // 解决图片跨域问题
      })
        .then((canvas) => {
          let imageUrl = canvas.toDataURL('image/png') // 将canvas转成base64图片格式
          this.canvasImageUrl = imageUrl
        })
        .catch((e) => console.log(e))
    },
  },
  updated() {
    this.htmlToCanvas()
  },
  created() {
    this.$route.query.approved_status === '1'
      ? (this.approved_status = true)
      : (this.approved_status = false)
    let data = {
      start: 0,
      limit: 10,
      contract_number: this.$route.query.contract_number,
    }
    if (data.contract_number) {
      getAfterContractInformation(data).then((res) => {
        this.form = {
          ...res.result[0],
          first_party_name1: res.result[0].first_party_name,
          second_party_name1: res.result[0].second_party_name,
        }
        let signing_date = dateFormatTwo(this.form.signing_date)
        this.form.signing_date = signing_date
        let end_date = dateFormatTwo(this.form.end_date)
        this.form.end_date = end_date
      })
    }
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
    .bill {
      overflow: hidden;
      border: 20px solid white;
    }
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
      a {
        color: #fff;
        text-decoration: none;
      }
      img {
        position: absolute;
        width: 200px;
        bottom: 220px;
        transform: rotate(-20deg);
        right: 100px;
      }
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
  .ruleForm {
    position: relative;
  }
}
</style>
