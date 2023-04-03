<template>
  <div class="test-wrapper">
    <mapPage @cityCountyStatus="cityCountyStatus" @getInnerInfo="getInnerInfo"></mapPage>
    <!-- 右侧信息 -->
    <div class="right-message-box">
      <div class="right-panel" :class="{ changeStatus: rightMessageStatus }">
        <div v-if="!rightMessageStatus">
          <div class="city-title">
            <h1>{{ dataInfo.name }}</h1>
            <i class="el-icon-top-right  " @click="rightMessageStatus = true"></i>
          </div>
          <div class="content-box">
            <div>
              <div><span>178</span>家</div>
              <div class="info-title">在绍外贸企业</div>
            </div>
            <div>
              <div><span>78</span>家</div>
              <div class="info-title">在绍外贸企业</div>
            </div>
          </div>
          <div class="content-box">
            <div>
              <div><span>19378</span>家</div>
              <div class="info-title">在绍外贸企业</div>
            </div>
            <div>
              <div><span>19378</span>家</div>
              <div class="info-title">在绍外贸企业</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-panel-height" :class="{ changeStatus: !rightMessageStatus }">
        <div v-if="rightMessageStatus">
          <div class="height-content-top">
            <div class="city-title">
              <div class="height-title">{{ dataInfo.name }}</div>
              <i class="el-icon-top-right  " @click="rightMessageStatus = false"></i>
            </div>
          </div>
          <div class="height-content-center">
            <div class="content-box">
              <div>
                <div><span>178</span>家</div>
                <div class="info-title">在绍外贸企业</div>
              </div>
              <div>
                <div><span>78</span>家</div>
                <div class="info-title">在绍外贸企业</div>
              </div>
            </div>
            <div class="content-box">
              <div>
                <div><span>19378</span>家</div>
                <div class="info-title">在绍外贸企业</div>
              </div>
              <div>
                <div><span>19378</span>家</div>
                <div class="info-title">在绍外贸企业</div>
              </div>
            </div>
          </div>
          <div class="height-content-end">
            <div>域内主要跨境电商企业名单：</div>
            <div class="table-header">
              <div class="number">序号</div>
              <div class="name">企业名称</div>
              <div class="gmv">近一年GMV</div>
            </div>
            <div class="table-info" v-for="(item, index) in 5" :key="index">
              <div class="number">{{ index + 1 }}</div>
              <div class="name">城云科技中国有限公司</div>
              <div class="gmv">1100000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapPage from './index.vue'
export default {
  components: {
    mapPage,
  },
  data() {
    return {
      selectDistrict: false, // 是否点击中某个区县
      cityInfo: {},
      rightMessageStatus: false, // 右侧信息展开状态
      dataInfo: {
        name: '绍兴市',
      },
    }
  },
  methods: {
    changeStatus() {
      this.status = !this.status
    },
    // 获取是否选中某个区县
    cityCountyStatus(selectDistrict, cityMessage) {
      if (selectDistrict) {
        this.dataInfo.name = cityMessage.name
      } else {
        this.dataInfo.name = '绍兴市'
      }
    },
    // 获取区县内部园区信息
    getInnerInfo(val) {
      this.dataInfo.name = val.name
    },
  },
}
</script>

<style lang="less">
.test-wrapper {
  .right-message-box {
    .right-panel {
      width: 350px;
      height: 260px;
      box-sizing: border-box;
      background: rgba(91, 96, 174, 0.8);
      border-radius: 20px;
      position: fixed;
      right: 20px;
      top: 20px;
      padding: 20px;
      transition: all 0.3s;
      z-index: 1000;
      color: #fff;
    }
    .right-panel-height {
      height: 750px;
      width: 350px;
      background: rgba(91, 96, 174, 0.8);
      border-radius: 20px;
      position: fixed;
      right: 20px;
      top: 20px;
      transition: all 0.7s;
      z-index: 1000;
      color: #fff;
      overflow: hidden;
      .height-content-top {
        height: 190px;
        background: #100b43;
        border-radius: 20px 20px 0 0;
        padding: 20px;
        box-sizing: border-box;
      }
      .height-content-center {
        padding: 0 20px 40px 20px;
        .content-box {
          margin-top: 45px;
          span {
            color: #fff;
          }
        }
      }
      .height-content-end {
        padding: 20px;
        .table-header {
          display: flex;
          margin-top: 10px;
          align-items: center;
          border: 1px solid #32a2e4;
          border-right-color: transparent;
          border-left-color: transparent;
          padding: 0 5px;
          line-height: 40px;
          font-size: 15px;
        }
        .table-info {
          display: flex;
          padding: 0 5px;
          line-height: 35px;
          font-size: 15px;
          .name {
            color: #02a7f0;
          }
        }
        .number {
          width: 40px;
          text-align: center;
        }
        .name {
          padding-left: 5px;
          width: 160px;
          box-sizing: border-box;
        }
        .gmv {
          width: 100px;
          text-align: center;
        }
      }
    }
    .city-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .height-title {
        font-size: 40px;
        font-weight: 800;
      }
    }
    .content-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      text-align: center;
      span {
        color: #ffff00;
        font-size: 25px;
        font-weight: 600;
        margin-right: 10px;
      }
      .info-title {
        margin-top: 15px;
        font-weight: 600;
      }
    }
    .changeStatus {
      background: transparent;
      height: 260px;
      z-index: -10;
    }
  }
}
</style>
