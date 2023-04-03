<template>
  <div class="rich-text-editor">
    <div class="bill" ref="bill">
      <div class="bill-inner">
        <div><span>合同名称：</span>{{ form.contract_name }}</div>
        <div class="content-wrapper">
          <div v-html="form.content"></div>
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
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { getAfterContractInformation } from '@/api'
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
        }
      })
    }
  },
}
</script>

<style lang="less">
.rich-text-editor {
  background: #fff;
  padding: 20px;
  img {
    position: absolute;
    width: 200px;
    bottom: 220px;
    transform: rotate(-20deg);
    right: 100px;
  }
  a {
    text-decoration: none;
    color: #fff;
  }
  .bill-inner {
    padding: 50px;
  }
  .content-wrapper {
    margin-top: 20px;
  }
  .btn {
    position: relative;
    text-align: center;
  }
}
</style>
