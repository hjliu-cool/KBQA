<template>
  <div class="industry-map-page">
    <div id="container"></div>
    <!-- 左上角过滤 -->
    <div class="filter-content">
      <div class="left-filter">
        重点产业类型
        <i @click="changeFilterStatus" class="el-icon-caret-bottom"></i>
      </div>
      <div class="search-wrapper">
        <el-input
          placeholder="请输入内容"
          style="width:250px;"
          suffix-icon="el-icon-search"
          v-model="searchValue"
          clearable
          @focus="openSearch"
        >
        </el-input>
      </div>
      <!-- 产业类型 -->
      <div class="left-filter-box" :class="{ 'box-open': filterStatus }">
        <div class="top-input">
          <el-input
            placeholder="请输入重点产业类型名称"
            suffix-icon="el-icon-search"
            v-model="filterSearch"
            clearable
          ></el-input>
        </div>
        <div class="type-content">
          <div class="type-wrapper" v-for="item in filterAllData" :key="item.firstName">
            <div style="padding:0 15px">
              <div
                class="type-name"
                style="cursor: pointer;"
                @click="
                  () => {
                    item.openStatus = !item.openStatus
                  }
                "
              >
                {{ item.firstName }}
                <i :class="item.openStatus ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
              </div>
              <div class="tag-wrapper" v-show="item.openStatus">
                <div
                  class="tag"
                  v-for="(e, index) in item.innerList"
                  :class="{ 'active-tag': e.status }"
                  :key="index"
                  @click="selectTypeTag(e)"
                >
                  {{ e.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 搜索结果 -->
      <div class="right-search-box" :class="{ 'box-open': searchStatus }">
        <div
          class="search-result-item"
          v-for="item in searchResultList"
          :key="item.id"
          @click="selectInnerPolygon(item.father, item.polygonId)"
        >
          <i class="el-icon-location-outline"></i> {{ item.name }}
        </div>
      </div>
    </div>
    <div class="control-wrapper">
      <el-button
        type="primary"
        @click="editInnerPolygonOpen"
        plain
        :disabled="!editInnerPolygon || !selectDistrict"
        >开始编辑</el-button
      >
      <el-button type="primary" @click="editInnerPolygonClose" plain :disabled="!editCloseSatatus"
        >完成编辑</el-button
      >
      <div class="change-map-box">
        <el-button type="primary" @click="changeMap(false)" plain>地图</el-button
        ><el-button type="primary" @click="changeMap(true)" plain>热力图</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  computed: {
    watchMove() {
      if (this.map) {
        return this.map.lngLatToContainer([120.582886, 30.051549], this.zoom)
      }
    },
  },
  watch: {
    // 需要边框存在的区县
    activeDistrict: {
      handler(val) {
        console.log(val)
        val.forEach((item) => {
          item.district.setOptions({ strokeOpacity: 1 })
        })
      },
    },
    activeDistrictMessage: {
      handler(val) {
        this.drowArcCanvasMessage()
      },
    },
    // 是否点击某个区域
    selectDistrict: {
      handler(val) {
        this.innerPolygonStatus()
        if (this.editCloseSatatus) {
          this.editInnerPolygonClose()
        }
        this.$emit('cityCountyStatus', val, this.activeDistrict[0])
        if (val) {
          this.selectFilterData = []
          this.filterAllDataSave.forEach((item) => {
            item.innerList.forEach((e) => (e.status = false))
            item.openStatus = false
          })
          console.log(this.selectFilterData)
        }
      },
    },
    activeinnerPolygon: {
      handler(val) {
        if (val) {
          val.setOptions({ fillColor: '#1BABE6', strokeColor: '#525CAA' })
          let findItem = this.allEditAndInnerPolygon[this.activeDistrict[0].name].editList.find(
            (iten) => iten.id === this.saveInnerId
          )
          this.editInnerPolygon = findItem.polygonEdit
          this.allEditAndInnerPolygon[this.activeDistrict[0].name].editList.forEach((item) => {
            item.polygonEdit.close()
          })
        } else {
          this.saveInnerId = ''
        }
      },
    },
    // 监听某个点是否变位置
    watchMove: {
      handler(val, oldVal) {
        if (oldVal && val) {
          if (oldVal.y !== val.y) {
            this.drowArcCanvasTitle()
            this.drowArcCanvasMessage()
            this.hotMapStatus && this.drowHotMap()
          }
        }
      },
    },
    searchValue(val) {
      this.searchStatus = val ? true : false
    },
    // 产业类型查询
    filterSearch(val) {
      if (val) {
        let filterResult = []
        filterResult = this.filterAllDataSave.map((item) => {
          let innerList = item.innerList.filter((e) => {
            if (e.label.indexOf(val) !== -1) {
              return e
            }
          })
          let res = {}
          if (innerList.length !== 0) {
            item.openStatus = true
            res.firstName = item.firstName
            res.innerList = innerList
            res.openStatus = item.openStatus
          }
          return res
        })
        filterResult = filterResult.filter((item) => item.firstName)
        this.filterAllData = filterResult
      } else {
        this.filterAllData = this.filterAllDataSave
      }
    },
    // 选中某个类型后监听事件
    selectFilterData(val) {
      if (this.selectDistrict) return
      this.activeDistrict.forEach((item) => item.district.setOptions({ strokeOpacity: 0 }))
      this.activeDistrict = []
      this.activeDistrictMessage = []
      Object.keys(this.allEditAndInnerPolygon).forEach((key) => {
        val.forEach((item) => {
          if (this.allEditAndInnerPolygon[key].messageList.includes(item.label)) {
            let findIndex = this.districtList.findIndex((e) => e.name === key)
            if (!this.activeDistrict.find((e) => e.name === key)) {
              this.activeDistrict.push(this.districtList[findIndex])
              this.activeDistrictMessage.push(this.districtList[findIndex])
            }
          }
        })
      })
    },
  },
  data() {
    return {
      map: '',
      titleCanvas: '', // 市区名称 canvas
      ctxTitle: '',
      messageCanvas: '', // 市区信息 canvas
      ctxMessage: '',
      zoom: 0,
      selectDistrict: false, // 是否点击中某个区县
      districtList: [], // 六个区县
      activeDistrict: [], // 需要边框存在的区县
      activeDistrictMessage: [], // 需要信息存在的区县
      innerPolygonList: [], // 某个区县中的园区Polygon选中的
      activeinnerPolygon: '', // 选中的innerPolygon
      innerMarkers: [], // 内部园区名称
      // 存储所有矢量图和编辑的对象
      allEditAndInnerPolygon: {
        上虞区: {
          editList: [],
          innerPolygonList: [],
          innerPolygonInfoList: [],
          markerList: [],
          messageList: ['集成电路', '电子信息', 'yaya'],
        },
        柯桥区: {
          editList: [],
          innerPolygonList: [],
          innerPolygonInfoList: [],
          markerList: [],
          messageList: ['集成电路', '高端智能装备', 'yaya'],
        },
        越城区: {
          editList: [],
          innerPolygonList: [],
          innerPolygonInfoList: [],
          markerList: [],
          messageList: ['张三', 'haha', '园区3', '园区', '集成电路'],
        },
        诸暨市: {
          editList: [],
          innerPolygonList: [],
          innerPolygonInfoList: [],
          markerList: [],
          messageList: ['张四', 'haha', 'yaya', '集成电路'],
        },
        嵊州市: {
          editList: [],
          innerPolygonList: [],
          innerPolygonInfoList: [],
          markerList: [],
          messageList: ['张五', '新材料', 'yaya'],
        },
        新昌县: {
          editList: [],
          innerPolygonList: [],
          innerPolygonInfoList: [],
          markerList: [],
          messageList: ['张流', 'haha', 'yaya'],
        },
      },
      editInnerPolygonList: [], // 编辑时，显示的内部矢量图
      saveInnerId: '', // 编辑对象id
      editInnerPolygon: '', //编辑对象
      editCloseSatatus: false, // 当前是否可完成编辑
      hotMapCanvas: '',
      ctxHotMap: '',
      hotMapStatus: false,

      searchValue: '', // 搜索输入框值
      filterSearch: '', // 产业定位下拉中的搜索值
      filterStatus: false, // 产业类型下拉状态
      filterAllDataSave: [
        {
          firstName: '新一代信息技术',
          innerList: [
            { label: '集成电路', status: false },
            { label: '智能传感器', status: false },
            { label: '工业互联网', status: false },
            { label: '人工智能', status: false },
            { label: '大数据', status: false },
            { label: '智能硬件', status: false },
            { label: '电子信息', status: false },
          ],
          openStatus: false,
        },
        {
          firstName: '高端装备制造',
          innerList: [
            { label: '汽车', status: false },
            { label: '高端智能装备', status: false },
            { label: '智能制造', status: false },
            { label: '航空航天', status: false },
            { label: '机器人', status: false },
            { label: '北斗导航', status: false },
          ],
          openStatus: false,
        },
        {
          firstName: '新材料',
          innerList: [
            { label: '新材料', status: false },
            { label: '绿色材料', status: false },
          ],
          openStatus: false,
        },
      ],
      filterAllData: [], // 所有产业类型
      selectFilterData: [], // 选中的产业类型
      searchStatus: false, // 搜索框下拉状态
      searchResultList: [
        { father: '上虞区', polygonId: 1, name: '啥啥啥园区' },
        { father: '上虞区', polygonId: 2, name: '哈哈哈园区' },
      ], // 搜索内容
    }
  },
  methods: {
    drowHotMap() {
      this.ctxHotMap.clearRect(0, 0, this.hotMapCanvas.width, this.hotMapCanvas.height)
      this.zoom = this.map.getZoom()
      let xy = this.map.lngLatToContainer([120.582886, 30.051549], this.zoom)
      var gradient = this.ctxHotMap.createRadialGradient(xy.x, xy.y, 150, xy.x, xy.y, 0)
      gradient.addColorStop(0, 'RGBA(252,235,210,0.02)')
      gradient.addColorStop(0.7, 'RGBA(243,161,40,0.6)')
      gradient.addColorStop(1, 'RGBA(243,161,40,1)')
      this.ctxHotMap.beginPath()
      this.ctxHotMap.fillStyle = gradient
      this.ctxHotMap.arc(xy.x, xy.y, 130, 0, 2 * Math.PI)
      this.ctxHotMap.fill()
      this.ctxHotMap.closePath()
    },
    changeMap(val) {
      if (val) {
        this.drowHotMap()
      } else {
        this.ctxHotMap.clearRect(0, 0, this.hotMapCanvas.width, this.hotMapCanvas.height)
      }
      this.hotMapStatus = val
    },
    // 打开编辑
    editInnerPolygonOpen() {
      this.editInnerPolygon.open()
      this.editCloseSatatus = true
    },
    // 完成编辑
    editInnerPolygonClose() {
      if (!this.editCloseSatatus) return
      this.editInnerPolygon && this.editInnerPolygon.close()
      if (this.editInnerPolygon && this.activeDistrict[0]) {
        console.log('当前编辑的区县:', this.activeDistrict[0].name)
        console.log('当前编辑的区域id:', this.saveInnerId)
        console.log('当前编辑的新坐标:', this.editInnerPolygon.$t)
      }
      this.editCloseSatatus = false
    },
    // 搜索选中园区
    selectInnerPolygon(father, polygonId) {
      // 清除市区名称
      this.ctxTitle.clearRect(0, 0, this.titleCanvas.width, this.titleCanvas.height)
      this.selectDistrict = true // 是否选择设置为true
      let findItem = this.districtList.find((item) => item.name == father)
      // 选中上虞区
      this.activeDistrict.push(findItem)
      // 选择园区
      setTimeout(() => {
        let polygonItem = this.allEditAndInnerPolygon[father].innerPolygonInfoList.find(
          (e) => e.id === polygonId
        )
        this.saveInnerId = polygonId
        polygonItem.polygon.setOptions({
          fillColor: '#C5BAF1',
          strokeColor: '#1EABFB',
        })
        this.$emit('getInnerInfo', polygonItem)
        this.activeinnerPolygon &&
          this.activeinnerPolygon.setOptions({
            fillColor: '#C5BAF1',
            strokeColor: '#1EABFB',
          })
        this.activeinnerPolygon = polygonItem.polygon
        this.map.setZoomAndCenter(13, polygonItem.center)
      }, 100)
    },
    // 绘制区县名称
    drowTitle(coordinate, name, ctx) {
      this.zoom = this.map.getZoom()
      let xy = this.map.lngLatToContainer(coordinate, this.zoom)
      ctx.beginPath()
      ctx.arc(xy.x + 16, xy.y + 2.5, 12.5, 0, 2 * Math.PI)
      ctx.fillStyle = 'RGB(82,90,127)'
      ctx.fill()
      ctx.closePath()
      ctx.beginPath()
      ctx.beginPath()
      ctx.arc(xy.x - 25, xy.y + 2.5, 12.5, 0, 2 * Math.PI)
      ctx.fillStyle = 'RGB(82,90,127)'
      ctx.fill()
      ctx.closePath()
      ctx.beginPath()

      ctx.beginPath()
      ctx.rect(xy.x, xy.y, 20, 30)
      ctx.font = '16px'
      ctx.fillStyle = 'RGB(82,90,127)'
      ctx.fillRect(xy.x - 25, xy.y - 10, 45, 25)
      ctx.fillStyle = 'RGB(255, 255, 255)'
      ctx.fillText(name, xy.x - 18, xy.y + 6)
      ctx.closePath()
    },
    // 绘制区县信息
    drowMessage(coordinate, name, ctx) {
      this.zoom = this.map.getZoom()
      let xy = this.map.lngLatToContainer(coordinate, this.zoom)
      let arr = this.allEditAndInnerPolygon[name].messageList
      // 绘制空白间隔
      ctx.beginPath()
      ctx.fillStyle = 'RGB(255,255,255)'
      ctx.fillRect(xy.x - 65, xy.y - 30, 115, 10)
      ctx.closePath()
      // 绘制具体信息
      arr.forEach((e, index) => {
        ctx.beginPath()
        ctx.fillStyle = 'RGB(255,255,255)'
        ctx.fillRect(xy.x - 65, xy.y - 54 - index * 19, 115, 25)
        ctx.fillStyle = 'RGB(120,124,125)'
        ctx.font = '12px Microsoft YaHe'
        ctx.fillText(e, xy.x - 53, xy.y - 35 - index * 19)
        ctx.closePath()
      })
      // 绘制头部名字和样式
      ctx.beginPath()
      ctx.fillStyle = 'RGB(255,255,255)'
      ctx.fillRect(xy.x - 65, xy.y - 60 - arr.length * 19, 115, 30)
      ctx.fillStyle = 'RGB(69,124,254)'
      ctx.font = 'bold 12px Microsoft YaHe'
      ctx.fillText(name, xy.x - 53, xy.y - 40 - arr.length * 19)
      ctx.closePath()
      ctx.beginPath()
      ctx.strokeStyle = 'RGB(202,218,249)'
      ctx.moveTo(xy.x - 55, xy.y - 31 - arr.length * 19)
      ctx.lineTo(xy.x + 5, xy.y - 31 - arr.length * 19)
      ctx.moveTo(xy.x + 5, xy.y - 31 - arr.length * 19)
      ctx.lineTo(xy.x + 20, xy.y - 38 - arr.length * 19)
      ctx.moveTo(xy.x + 20, xy.y - 38 - arr.length * 19)
      ctx.lineTo(xy.x + 35, xy.y - 38 - arr.length * 19)
      ctx.stroke()
      ctx.closePath()
    },
    // 画市区名称
    drowArcCanvasTitle() {
      if (this.selectDistrict) return
      this.ctxTitle.clearRect(0, 0, this.titleCanvas.width, this.titleCanvas.height)
      this.districtList.forEach((item) => {
        this.drowTitle([item.center.lng, item.center.lat], item.name, this.ctxTitle)
      })
    },
    // 画区县信息
    drowArcCanvasMessage() {
      if (this.selectDistrict) return
      this.ctxMessage.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height)
      this.activeDistrictMessage.forEach((item) => {
        this.drowMessage([item.center.lng, item.center.lat], item.name, this.ctxMessage)
      })
    },
    // 处理某个区县内的园区显示状态
    innerPolygonStatus() {
      if (this.selectDistrict) {
        if (this.activeDistrict[0].name !== '上虞区') return
        let innerPolygonObjec = this.allEditAndInnerPolygon[this.activeDistrict[0].name] //取出当前区域的对象
        // add
        let polygon1 = [
          new AMap.LngLat(120.907744, 29.970493),
          new AMap.LngLat(120.974447, 29.949079),
          new AMap.LngLat(120.915532, 29.881578),
          new AMap.LngLat(120.868467, 29.928246),
        ]
        let polygon2 = [
          new AMap.LngLat(120.931803, 29.83039),
          new AMap.LngLat(120.979357, 29.827089),
          new AMap.LngLat(120.915159, 29.797794),
        ]
        let arr = [
          { id: 1, name: '啥啥啥园区', path: polygon1, center: [120.916415, 29.935867] },
          { id: 2, name: '哈哈哈园区', path: polygon2, center: [120.94023, 29.819855] },
        ]
        if (innerPolygonObjec.editList.length < arr.length) {
          arr.forEach((item) => {
            const innerPolygon = new AMap.Polygon({
              path: item.path,
              fillOpacity: 0.3, // 多边形填透明度
              fillColor: '#C5BAF1', // 多边形填充颜色
              strokeColor: '#1EABFB', // 线条颜色
              strokeOpacity: 1, // 轮廓线透明度
              strokeStyle: 'base', // 轮廓线样式
              bubble: true,
            })
            innerPolygon.on('mouseover', () => {
              innerPolygon.setOptions({ fillColor: '#1BABE6' })
            })
            innerPolygon.on('mouseout', () => {
              if (this.activeinnerPolygon == innerPolygon) return
              innerPolygon.setOptions({ fillColor: '#C5BAF1' })
            })
            innerPolygon.on('click', () => {
              this.map.setZoomAndCenter(13, item.center)
              if (this.activeinnerPolygon == innerPolygon) return
              this.activeinnerPolygon &&
                this.activeinnerPolygon.setOptions({
                  fillColor: '#C5BAF1',
                  strokeColor: '#1EABFB',
                })
              this.$emit('getInnerInfo', item)
              this.activeinnerPolygon = innerPolygon
              this.saveInnerId = item.id
            })

            // 矢量图
            innerPolygonObjec.innerPolygonList.push(innerPolygon)
            innerPolygonObjec.innerPolygonInfoList.push({
              id: item.id,
              center: item.center,
              name: item.name,
              polygon: innerPolygon,
            })

            // 编辑
            let polygonEdit = new AMap.PolyEditor(this.map, innerPolygon)
            innerPolygonObjec.editList.push({ id: item.id, polygonEdit })
            // marker
            let content = `<div class='marker-style'><div class="marker-message">${item.name}</div></div>`
            var marker = new AMap.Marker({
              position: item.center,
              offset: new AMap.Pixel(-55, -30),
              content,
            })
            innerPolygonObjec.markerList.push(marker)
          })
        }
        this.innerMarkers = innerPolygonObjec.markerList
        this.innerPolygonList = innerPolygonObjec.innerPolygonList
        this.map.add(this.innerMarkers)
        this.map.add(innerPolygonObjec.innerPolygonList)
      } else {
        // remove
        this.map.remove(this.innerMarkers)
        this.map.remove(this.innerPolygonList)
        this.activeinnerPolygon &&
          this.activeinnerPolygon.setOptions({
            fillColor: '#C5BAF1',
            strokeColor: '#1EABFB',
          })
        this.activeinnerPolygon = ''
      }
    },
    //矢量多边形
    initStroke() {
      const that = this
      AMap.plugin('AMap.DistrictSearch', function() {
        let districtSearch = new AMap.DistrictSearch({
          level: 'city',
          subdistrict: 1,
          extensions: 'base',
        })
        districtSearch.search('绍兴', function(status, result) {
          result.districtList[0].districtList.forEach((item) => {
            AMap.plugin('AMap.DistrictSearch', function() {
              let innerDistrictSearch = new AMap.DistrictSearch({
                level: 'district',
                subdistrict: 0,
                extensions: 'all',
              })
              innerDistrictSearch.search(item.name, function(status, res) {
                let x = res.districtList[0].center.lat * 1
                let y = res.districtList[0].center.lng * 1
                const polygon = new AMap.Polygon({
                  path: res.districtList[0].boundaries,
                  fillOpacity: 0, // 多边形填透明度
                  fillColor: '#fbc', // 多边形填充颜色
                  strokeColor: '#569CF8', // 线条颜色
                  strokeOpacity: 0,
                  strokeStyle: 'dashed',
                  bubble: true,
                })

                polygon.on('mouseover', () => {
                  if (!that.selectDistrict) {
                    polygon.setOptions({ strokeOpacity: 1 })
                    that.activeDistrictMessage.push({
                      name: res.districtList[0].name,
                      adcode: res.districtList[0].adcode,
                      center: res.districtList[0].center,
                    })
                  }
                })
                polygon.on('mouseout', () => {
                  if (!that.selectDistrict) {
                    let findIdx = that.activeDistrict.findIndex(
                      (e) => e.adcode === res.districtList[0].adcode
                    )
                    if (findIdx === -1) {
                      polygon.setOptions({ strokeOpacity: 0 })
                      that.ctxMessage.clearRect(
                        0,
                        0,
                        that.messageCanvas.width,
                        that.messageCanvas.height
                      )
                    }
                    let findIndex = that.activeDistrictMessage.findIndex(
                      (e) => e.adcode === res.districtList[0].adcode
                    )
                    that.activeDistrictMessage.splice(findIndex, 1)
                  }
                })
                polygon.on('click', () => {
                  if (that.selectDistrict) return
                  that.selectDistrict = true
                  that.activeDistrict.forEach((item) =>
                    item.district.setOptions({ strokeOpacity: 0 })
                  )
                  that.activeDistrict = [] // 清空所有激活的边框
                  that.activeDistrictMessage = [] // 清空所有激活的信息
                  // 清空区县标题画布
                  that.ctxTitle.clearRect(0, 0, that.titleCanvas.width, that.titleCanvas.height)
                  // 清空区县信息画布
                  that.ctxMessage.clearRect(
                    0,
                    0,
                    that.messageCanvas.width,
                    that.messageCanvas.height
                  )
                  that.activeDistrict.push({
                    district: polygon,
                    name: res.districtList[0].name,
                    adcode: res.districtList[0].adcode,
                  })
                  that.map.setZoomAndCenter(11, [
                    res.districtList[0].center.lng,
                    res.districtList[0].center.lat,
                  ])
                })
                // 存储所有区县
                that.districtList.push({
                  district: polygon,
                  name: res.districtList[0].name,
                  adcode: res.districtList[0].adcode,
                  center: res.districtList[0].center,
                })
                that.map.add(polygon)
                that.drowTitle([y, x], res.districtList[0].name, that.ctxTitle)
              })
            })
          })
        })
      })
    },
    // 输入框获取焦点是否打开下拉内容
    openSearch() {
      this.searchStatus = this.searchValue ? true : false
      this.filterStatus = false
    },
    // 过滤box显示状态
    changeFilterStatus() {
      if (!this.selectDistrict) {
        this.filterStatus = !this.filterStatus
        this.searchStatus = false
      }
    },
    // 产业类型中具体tag点击事件
    selectTypeTag(e) {
      e.status = !e.status
      if (e.status) {
        this.selectFilterData.push(e)
      } else {
        let findIndex = this.selectFilterData.findIndex((item) => item.label === e.label)
        this.selectFilterData.splice(findIndex, 1)
      }
    },
  },
  mounted() {
    AMapLoader.load({
      key: 'e15d1cb976e82e8b430c4ef31b9c52a2', // 申请好的Web端开发者Key，首次调用 load 时必填
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.LngLat',
        'AMap.Polygon',
        'AMap.CustomLayer',
        'AMap.PolyEditor',
      ],
    })
      .then((AMap) => {
        this.AMap = AMap
        this.map = new AMap.Map('container', {
          zoom: 9, //级别
          center: [120.582886, 30.051549], //中心点坐标
          viewMode: '3D', //使用3D视图
          resizeEnable: true,
          zIndex: 1,
          zooms: [8, 16],
          // scrollWheel: false,
        })

        // 自定义canvas图层-区县名称
        this.titleCanvas = document.createElement('canvas')
        this.titleCanvas.width = this.map.getSize().width
        this.titleCanvas.height = this.map.getSize().height
        let customLayer = new AMap.CustomLayer(this.titleCanvas, {
          zIndex: 11,
        })
        this.ctxTitle = this.titleCanvas.getContext('2d')
        this.map.add(customLayer)

        // 自定义canvas图层-区县内容
        this.messageCanvas = document.createElement('canvas')
        this.messageCanvas.width = this.map.getSize().width
        this.messageCanvas.height = this.map.getSize().height
        let innerMessage = new AMap.CustomLayer(this.messageCanvas, {
          zIndex: 12,
        })
        this.ctxMessage = this.messageCanvas.getContext('2d')
        this.map.add(innerMessage)

        // 自定义canvas图层-热力图
        this.hotMapCanvas = document.createElement('canvas')
        this.hotMapCanvas.width = this.map.getSize().width
        this.hotMapCanvas.height = this.map.getSize().height
        let hotMap = new AMap.CustomLayer(this.hotMapCanvas, {
          zIndex: 13,
        })
        this.ctxHotMap = this.hotMapCanvas.getContext('2d')
        this.map.add(hotMap)

        this.initStroke() // 初始化矢量图
        // 地图移动
        this.map.on('mapmove', () => {
          this.drowArcCanvasTitle()
          this.drowArcCanvasMessage()
          this.hotMapStatus && this.drowHotMap()
        })
        // 地图缩放
        this.map.on('zoomstart', () => {
          if (this.zoom === 16 || this.zoom === 8) return
          // this.ctxTitle.clearRect(0, 0, this.titleCanvas.width, this.titleCanvas.height)
          // this.ctxMessage.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height)
        })
        this.map.on('zoomend', () => {
          this.zoom = this.map.getZoom()
          if (this.zoom <= 10 && this.selectDistrict) {
            this.activeDistrict.forEach((item) => item.district.setOptions({ strokeOpacity: 0 }))
            this.activeDistrict = []
            this.selectDistrict = false
          }
          // this.drowArcCanvasTitle()
        })
        this.map.on('moveend', () => {
          this.searchStatus = false
          this.filterStatus = false
        })
        this.map.on('click', () => {
          this.searchStatus = false
          this.filterStatus = false
        })
        // 添加控件
        const toolBar = new AMap.ToolBar({
          liteStyle: true,
          offset: new AMap.Pixel(22, 130),
        })
        // 比例尺
        const scale = new AMap.Scale({
          visible: true,
          position: 'RB',
        })
        this.map.addControl(toolBar)
        this.map.addControl(scale)
      })
      .catch((e) => {
        console.log(e)
      })
  },
  created() {
    this.filterAllData = this.filterAllDataSave
  },
}
</script>

<style lang="less">
.industry-map-page {
  #container {
    width: 100vw;
    height: 100vh;
  }
  .marker-style {
    background: #13a7e5;
    padding: 0 10px;
    border-radius: 20px;
    height: 25px;
    line-height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(255, 255, 255);
    .marker-message {
      min-width: 75px;
      font-size: 12px;
      max-width: 150px;
      white-space: nowrap;
      &::after {
        content: '';
        position: absolute;
        left: ceil(50%-10px);
        display: inline-block;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #13a7e5;
        bottom: -10px;
      }
    }
  }
  .change-map-box {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0 0 20px 20px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    border-radius: 20px;
  }

  .filter-content {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    .left-filter {
      width: 145px;
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      justify-content: space-between;
      margin-right: 10px;
      background: #fff;
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
      i {
        cursor: pointer;
      }
    }
    .search-wrapper {
      height: 40px;
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
      .el-input__inner {
        border-radius: 0;
      }
    }
    .right-search-box,
    .left-filter-box {
      position: absolute;
      width: 405px;
      height: 0;
      background: #fff;
      top: 40px;
      transition: all 0.5s;
      overflow: hidden;
    }
    .left-filter-box {
      padding: 0 20px;
      box-sizing: border-box;
      .top-input {
        margin-top: 20px;
      }
      .type-content {
        margin-top: 20px;
        background: #f5f5f5;
        .type-wrapper {
          font-size: 14px;
          border-top: 1px solid #d7d7d7;
          &:last-child {
            border-bottom: 1px solid #d7d7d7;
          }
          .type-name {
            display: flex;
            justify-content: space-between;
            height: 45px;
            font-weight: 600;
            align-items: center;
          }
          .tag-wrapper {
            margin-top: 5px;
            cursor: pointer;
            .tag {
              border: 1px solid #d7d7d7;
              margin: 0 10px 10px 0;
              border-radius: 20px;
              padding: 0px 10px;
              line-height: 25px;
              display: inline-block;
            }
            .active-tag {
              color: #3974fe;
              border: 1px solid #3974fe;
            }
          }
        }
      }
    }

    .right-search-box {
      width: 250px;
      left: 155px;
      .search-result-item {
        text-align: left;
        padding: 0 14px;
        display: block;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 35px;
        border-bottom: 1px dashed #eee;
        cursor: pointer;
        &:hover {
          background: rgba(223, 235, 246, 0.8);
        }
      }
    }
    .box-open {
      height: 80vh;
    }
  }
  .control-wrapper {
    position: fixed;
    bottom: 0;
    right: 40%;
  }
}
</style>
