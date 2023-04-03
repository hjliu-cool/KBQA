<template>
  <div class="internshipAgreement">
    <div class="internship">
      <el-form :model="form" ref="form" label-width="200px" class="ruleForm">
        <div class="bill" ref="bill">
          <h1>实习协议</h1>
          <div>
            <el-form-item label="甲方(实习单位)：" prop="first_party_name">
              {{ form.first_party_name }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="乙方(实习人员)：" prop="second_party_name">
              {{ form.second_party_name }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="身份证号：" prop="second_party_id">
              {{ form.second_party_id }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="联系电话：" prop="second_party_phone">
              {{ form.second_party_phone }}
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
                {{ form.start_date }}
              </el-form-item>
              <span> 起，至 </span>
              <el-form-item label-width="0px" prop="end_date">
                {{ form.end_date }}
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
            <span class="suojin">
              甲方按照企业现行规章制度以及乙方在实习期间的具体实习情况，予以发放实习津贴</span
            >
            <el-form-item label-width="0px" prop="contract_amount">
              {{ form.contract_amount }}
            </el-form-item>
            <span> 元/月。甲方为乙方加纳以外险。</span>
          </div>
          <div class="autograph">
            <div>
              <el-form-item label="甲方(实习单位)：" prop="first_party_name1">
                {{ form.first_party_name1 }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="乙方(实习人员)：" prop="second_party_name1">
                {{ form.second_party_name1 }}
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
import { dateFormat } from '@/utils'
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
        let end_date = dateFormat(this.form.end_date)
        let start_date = dateFormat(this.form.start_date)
        let signing_date = dateFormat(this.form.signing_date)
        this.form.end_date = end_date.replace('00:00:00', '')
        this.form.start_date = start_date.replace('00:00:00', '')
        this.form.signing_date = signing_date.replace('00:00:00', '')
      })
    }
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
    .bill {
      overflow: hidden;
      border: 20px solid white;
    }
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
