<template>
  <div class="firstPage">
    <div class="card_wrap">
      <div class="one_card">
        <span>总合同数</span>
        <span>{{ count.approval + count.cantapproval + count.noapproval }}</span>
      </div>
      <div class="second_card">
        <span>待审批数</span>
        <span>{{ count.noapproval }}</span>
      </div>
      <div class="third_card">
        <span>审批通过数</span>
        <span>{{ count.approval }}</span>
      </div>
      <div class="fourth_card">
        <span>审批未通过数</span>
        <span>{{ count.cantapproval }}</span>
      </div>
    </div>
    <div class="bottom_wrapper">
      <div class="echarts_wrapper">
        <div class="echarts" id="main"></div>
      </div>
      <div class="scroll_wrapper" id="scroll_wrapper">
        <div class="title">
          <span>时间</span><span class="user">用户</span><span class="last">操作</span>
        </div>
        <div id="ul-wrapper" class="ul-wrapper">
          <ul>
            <li v-for="item in logList" :key="item.time">
              <span>{{ item.time }}</span
              ><span class="user">{{ item.user }}</span
              ><span class="last">{{ item.message }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getContractCount, getOperationLog, getTypeContract } from '@/api'
export default {
  watch: {
    //观察option的变化
    option: {
      handler(newVal, oldVal) {
        this.myEcharts()
      },
      deep: true, //对象内部属性的监听，关键。
    },
  },
  data() {
    return {
      count: {},
      logList: [],
      option: {
        title: {
          text: '合同汇总',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ccc',
            fontStyle: 'italic', //标题字体
          },
        },
        //图例，选择要显示的项目
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#c8c8d0',
          },
          data: ['项目合同', '保密协议', '实习合同', '劳动合同', '自定义合同'], //注意要和数据的name相对应
        },
        //工具箱
        toolbox: {
          show: true, //显示工具箱
          feature: {
            dataView: { show: true }, //以文字形式显示数据
            restore: { show: true }, //还原
            // dataZoom: { show: true }, //区域缩放
            saveAsImage: { show: true }, //保存图片
            // magicType: { type: ['line', 'bar'] }, //动态数据切换，数据显示可以在该规定内容中切换显示方式，
          },
        },
        tooltip: {},
        series: [
          {
            // name: '合同',
            type: 'pie',
            radius: '55%',
            data: [
              { value: 2, name: '项目合同' },
              { value: 5, name: '保密协议' },
              { value: 6, name: '实习合同' },
              { value: 1, name: '劳动合同' },
              { value: 3, name: '自定义合同' },
            ],
          },
        ],
        backgroundColor: '#2c343c',
        roseType: 'angle',
        itemStyle: {
          // 阴影的大小
          shadowBlur: 200,
          // 阴影水平方向上的偏移
          shadowOffsetX: 0,
          // 阴影垂直方向上的偏移
          shadowOffsetY: 0,
          // 阴影颜色
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }
  },
  methods: {
    scrollUlLog() {
      let wrapper = document.getElementById('ul-wrapper')
      let setTime = setInterval(() => {
        if (wrapper.scrollTop >= wrapper.offsetHeight) {
          wrapper.scrollTop = 0
        } else {
          wrapper.scrollTop += 1
        }
      }, 100)
      wrapper.addEventListener('mouseleave', () => {
        setTime = setInterval(() => {
          if (wrapper.scrollTop > wrapper.offsetHeight) {
            wrapper.scrollTop = 0
          } else {
            wrapper.scrollTop += 1
          }
        }, 100)
      })
      wrapper.addEventListener('mouseenter', () => {
        clearInterval(setTime)
      })
    },
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据

      myChart.setOption(this.option)
    },
  },
  mounted() {
    this.scrollUlLog()
  },
  created() {
    getContractCount().then((res) => {
      this.count = { ...res.result }
    })
    getTypeContract().then((res) => {
      this.option.series[0].data = res.data
    })
    getOperationLog().then((res) => {
      this.logList = res.data.reverse()
    })
  },
}
</script>

<style lang="less">
.firstPage {
  background-color: #fff;
  padding: 20px;
  min-height: 100%;
  box-sizing: border-box;
  .card_wrap {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 20%;
    div {
      width: 23%;
      padding: 20px;
      box-sizing: border-box;
      background-color: rgb(166, 179, 179);
      border-radius: 10px;
      font-size: 30px;
      color: #fff;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .one_card {
      background-color: rgb(212, 224, 96);
    }
    .second_card {
      background-color: rgb(126, 224, 96);
    }
    .third_card {
      background-color: rgb(96, 183, 224);
    }
    .fourth_card {
      background-color: rgb(96, 119, 224);
    }
  }

  .bottom_wrapper {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    margin: 30px 15px 0 15px;
    height: 500px;
    background: #2c343c;
    .scroll_wrapper {
      width: 50%;
      .title {
        font-size: 18px;
        font-weight: 550;
        color: #464749;
        span {
          display: inline-block;
          width: 33%;
          text-align: left;
        }
        .user {
          width: 100px;
        }
        .last {
          width: auto;
        }
      }
      .ul-wrapper {
        height: 99%;
        overflow-y: auto;
        ul {
          list-style: none;
          line-height: 30px;
          background: #2c343c;
          color: rgba(255, 255, 255, 0.3);
          li {
            border-bottom: 1px solid rgba(0, 0, 0, 0.3);
            span {
              display: inline-block;
              width: 33%;
              text-align: left;
            }
            .user {
              width: 100px;
            }
            .last {
              width: auto;
            }
          }
        }
      }
      .ul-wrapper::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
        scrollbar-arrow-color: red;
      }
      .ul-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 5px; /*滑块的圆角*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
        scrollbar-arrow-color: red;
      }
      .ul-wrapper::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
    }
    .echarts_wrapper {
      width: 50%;
      .echarts {
        // min-width: 600px;
        height: 500px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
