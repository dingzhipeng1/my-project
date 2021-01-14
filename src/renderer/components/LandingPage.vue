<template>
  <div id="wrapper">
<!--    <el-button @click="setdata">
      set
    </el-button>
    <el-button @click="getdata">
      get
    </el-button>-->
    <audio ref="audio"
           preload
           :src="music.url"
           crossorigin="anonymous"></audio>


    <!--      <audio ref="audio2"-->
    <!--             preload-->
    <!--             :src="music.url2"-->
    <!--             crossorigin="anonymous" autoplay></audio>-->

    <div v-if="step==0">
      <div style="display: flex;align-items: center;justify-content:space-between;margin-bottom: 16px">
        <div class="lef_warp">
          <el-button type="primary" style="margin-right: 12px" @click="getHYlist()">刷新板块</el-button>
          <el-button type="primary" @click="checkHYall()">反选</el-button>
          <el-input plase="每行业读几条数据" v-model="GPCount"></el-input>

        </div>
        <div>

          <el-input placeholder="名字" v-model="searchName" style="width: auto"></el-input>
          <el-button type="primary" @click="saveHY()" style="margin-left: 12px">保存</el-button>
        </div>


      </div>
      <el-table
          :row-class-name="tableRowClassName"
          :data="list"
          height="700px"
          @row-click="checkfunstate"

      >
        <el-table-column
            prop="name"
            label="代码"
            width="180">
          <template slot-scope="scope">{{ scope.row.data[0] }}</template>
        </el-table-column>
        <el-table-column

            label="名字">
          <template slot-scope="scope">{{ scope.row.data[1] }}</template>
        </el-table-column>
        <el-table-column

            label="涨幅">
          <template slot-scope="scope">{{ scope.row.data[3] }}%</template>
        </el-table-column>

      </el-table>


    </div>


    <div v-if="step==1">

      <el-button type="primary" @click="reset()">重新设置</el-button>
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="width: 48%">
          <div style="padding: 16px">

          </div>
          <el-table :data="ZTBArr"
                    :row-class-name="DCDClass"
                    @row-click="showdiag"
                    height="400px">


            <el-table-column
                sortable
                prop="name"
                label="MAISHOU"
            >
              <template slot-scope="scope">{{ scope.row.MAISHOU }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="代码"
            >
              <template slot-scope="scope">{{ scope.row.data[0] }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名字"
                width="180">
              <template slot-scope="scope">{{ scope.row.data[1] }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="涨幅"
            >
              <template slot-scope="scope">{{ scope.row.data[3] }}</template>
            </el-table-column>
            <el-table-column
                prop="name"

                label="行业"
            >
              <template slot-scope="scope">{{ scope.row.HY }}{{ scope.row.PaiHang }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="排行"
                type="index"
                width="180">

            </el-table-column>
          </el-table>
        </div>
        <div style="width: 48%">
          <div style="padding: 16px">

          </div>
          <el-table :row-class-name="warningClass" @row-click="showdiag" :data="JJArr" height="400px">
            <el-table-column
                prop="needztcount"
                label="余量"
            >
              <template slot-scope="scope">{{ scope.row.needztcount }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="代码"
            >
              <template slot-scope="scope">{{ scope.row.data[0] }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名字"
                width="180">
              <template slot-scope="scope">{{ scope.row.data[1] }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="涨幅"
            >
              <template slot-scope="scope">{{ scope.row.data[3] }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="行业"
            >
              <template slot-scope="scope">{{ scope.row.HY }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="排行"
                width="180">
              <template slot-scope="scope">{{ scope.row.PaiHang }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>


    </div>


    <div class="doc" style="margin-bottom: 100px">
      <a class="alt" @click="open('https://electron.atom.io/docs/')">Electron</a>
      {{ path }}
    </div>

    <el-dialog :visible.sync="dialogflag">
      <img :src="chooseitem" alt="" style="width: 100%">
    </el-dialog>

  </div>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'
//在渲染器进程 (网页) 中。
import {remote} from 'electron';
//
// const win = remote.getCurrentWindow();
// const AC = new window.AudioContext();
// const analyser = AC.createAnalyser();
// const gainnode = AC.createGain();


window.myvue;

function getDateName() {
  var myDate = new Date();
  return `${myDate.getFullYear()}_${myDate.getMonth()}_${myDate.getDay()}`
}

// gainnode.gain.value = 1;
export default {
  name: 'landing-page',
  data() {
    return {
      path: this.$ipc.sendSync('configget', 'filepath'),
      DateName: getDateName(),
      dialogflag: false,
      chooseitem: '',
      GPCount: 3,
      searchName: '',
      voiceArr: [],
      oldZTBArr: [],//所有涨停过的股票
      ZTBArr: [],//涨停板数组
      JJArr: [],//即将涨停板数组
      IntervalArr: [],//定时器数组
      step: 0,//选择0表示选行业//1获取行业的股票
      list: [],//行业列表
      checkHYlist: [],
      music: {
        url: 'https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ie=utf-8&ctp=1&pdt=301&vol=9&rate=32&per=0&tex=' + '603325青海春天即将上板',
      }
    }
  },
  watch: {
    searchName() {

      this.searchby()
    }
  },
  methods: {
    quickSort(arr) {

      function sortId(a, b) {
        return a.MAISHOU - b.MAISHOU
      }

      arr.sort(sortId);


      return arr
    },
    quickSortJJZT(arr) {

      function sortId(a, b) {
        return a.needztcount - b.needztcount
      }

      arr.sort(sortId);
      return arr
    },

    isZB(code) {

      for (var obj of this.oldZTBArr) {
        if (obj == code) {
          return true
        }
      }
      return false;
    },
    checkHYall() {
      for (var o of this.list) {
        o.ischeck = !o.ischeck
      }


    },
    removeZT(code) {

      var flag = true
      for (var i in this.ZTBArr) {
        if (this.ZTBArr[i].data[0] == code) {

          this.ZTBArr.splice(i, 1)
        }
      }
    },
    removeJJZT(code) {

      var flag = true
      for (var i in this.JJArr) {
        if (this.JJArr[i].data[0] == code) {

          this.JJArr.splice(i, 1)
        }
      }
    },
    playVoice() {
      var audio = this.$refs.audio;
      if (this.voiceArr.length > 0) {
        audio.src = 'https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ie=utf-8&ctp=1&pdt=301&vol=9&rate=32&per=0&tex=0' + this.voiceArr.shift();
        audio.play()
      }

    },
    searchby() {
      var temparr = [];
      for (var i in this.list) {
        if (this.list[i].data[1].indexOf(this.searchName) != -1) {
          temparr.push(this.list[i])
          this.list.splice(i, 1)
        }
      }
      this.list = temparr.concat(this.list)
    },
    reset() {

      for (var o of this.IntervalArr) {
        clearInterval(o)
      }
      this.ZTBArr = [];
      this.step = 0;
    },

    shifouzhangting(code) {

      if (code.substring(0, 2) == '60') {
        code = 'sh' + code
      }
      if (code.substring(0, 2) == '00') {
        code = 'sz' + code
      }
      return new Promise((r1, r2) => {

        this.$axiosStr({
          method: 'get',
          url: 'http://hq.sinajs.cn/list=' + code
        }).then(res => {


          var arr = res.split('=')[1].split(',')
          if (arr[7] == 0) {
            //确定涨停
            r1({flag: true, count: arr[10] / 1000000, arr})
          } else {
            r1({flag: false, arr})
          }


        })

      })

    },
    async getGPList(HY) {

      this.$axios({
        method: 'post',
        url: 'https://pchq.kaipanla.com/w1/api/index.php',
        data: {
          c: 'PCArrangeData',
          a: 'GetZSIndexPlate',
          SelType: 3,
          LType: 6,
          LOrder: 1,
          LStart: '',
          LEnd: '',
          LIndex: 0,
          Lst: this.GPCount,
          PlateID: HY[0]
        }
      }).then(res => {
        let count = 0;
        for (var o of res.stocks.list) {
          count++


          if (o[0].indexOf('688') == 0 || o[0].indexOf('300') == 0 || o[2] > 50) {
            continue;
          }
          if (o[3] > 8.5) {
            var objtemp = {
              HY: HY[1],
              isbobao: false,
              isZT: false,
              isZB: false,
              PaiHang: count,
              data: o,
              MAISHOU: 0,
              DCD: false,//大撤单
              needztcount: 9999999
            };

            //obj.data[0]
            ((objtemp, o) => {
              this.shifouzhangting(o[0]).then(res => {

                let flag = true
                if (res.flag) {
                  //真涨停
                  flag = true
                  //遍历涨停板判断是否在涨停板数组里
                  for (var obj of this.ZTBArr) {//"log", +obj.data[0]+","+obj.data[1]+",买手"+obj.MAISHOU

                    if (obj.data[0] == o[0]) {
                      flag = false
                      if (obj.MAISHOU - res.count > 4) {
                        this.$ipc.send('log', `${obj.data[1]}|${obj.data[0]}|${(obj.MAISHOU - res.count).toFixed(2)}万`)
                        obj.DCD = true
                      }
                      obj.MAISHOU = res.count
                    }
                  }
                  if (flag) {
                    objtemp.MAISHOU = res.count
                    this.ZTBArr.unshift(objtemp)
                    this.oldZTBArr.unshift(objtemp.data[0])
                    this.$ipc.send("configset", {name: this.DateName, value: this.oldZTBArr});
                  }
                  this.ZTBArr = this.quickSort(this.ZTBArr)
                  this.removeJJZT(objtemp.data[0])
                } else {
                  //即将涨停
                  //昨收
                  // var zs = res.arr[2];
                  // var zt = Math.round(zs * 1000 * 1.1 / 10) / 100
                  // //卖5
                  // var maiwuprice = res.arr[29]
                  var needztcount = 99999999;

                  if (res.arr[28] == 0 && 0 == res.arr[29]) {
                    objtemp.needztcount = needztcount = (+res.arr[20] + +res.arr[22] + +res.arr[24] + +res.arr[26] + +res.arr[28]) / 1000000
                  }


                  flag = true
                  for (var obj of this.JJArr) {
                    if (obj.data[0] == o[0]) {
                      this.$set(obj.data, 3, o[3])
                      obj.needztcount = needztcount
                      flag = false
                    }
                  }
                  if (flag) {
                    objtemp.isZB = this.isZB(objtemp.data[0])
                    this.JJArr.unshift(objtemp)

                    this.JJArr = this.quickSortJJZT(this.JJArr)

                    this.voiceArr.unshift(objtemp.data[0] + objtemp.data[1] + '即将涨停')
                  }
                  this.removeZT(objtemp.data[0])
                }
              })
            })(objtemp, o)

          } else {
            //踢出涨停
            this.removeZT(o[0]);
            this.removeJJZT(o[0])
          }
        }


        //0是代码,1是名字，2是价格，3涨幅，4成交额，5换手率，6涨速
        //console.log(res.stocks.list[0][1])

      })

    },

    saveHY() {


      // voiceArr: [],
      //     oldZTBArr: [],//所有涨停过的股票
      //     ZBArr:[],//炸板arr
      //     ZTBArr: [],//涨停板数组
      //     JJArr: [],//即将涨停板数组
      //     IntervalArr: [],//定时器数组
      //     step: 0,//选择0表示选行业//1获取行业的股票
      //     list: [],//行业列表
      //     checkHYlist: [],

      this.voiceArr = []
      this.ZBArr = []
      this.ZTBArr = []
      this.JJArr = []
      this.step = []
      this.checkHYlist = []

      var data = this.$ipc.sendSync('configget', this.DateName);
      this.oldZTBArr = data ? data : []
      var arrHY = []
      for (var o of this.IntervalArr) {
        clearInterval(o)
      }
      this.IntervalArr = []
      for (var o of this.list) {
        if (o.ischeck == true) {
          var code = o.data[0];
          arrHY.push(code)
          var that = this;
          (function (arg) {
            that.IntervalArr.push(
                setInterval(() => {

                  that.getGPList(arg)
                }, 5000)
            )
          })(o.data)


        }
      }
      if (arrHY.length == 0) {
        this.$alert("请先选择行业")
        return;
      }
      this.checkHYlist = arrHY;
      this.step = 1;


      this.IntervalArr.push(setInterval(() => {

          if(new  Date().getMinutes()%60==0){
              this.voiceArr.push("该喝水了,该喝水了,该喝水了");
          }

          if(new  Date().getMinutes()=="53"&&new  Date().getHours()=="14") {
              this.voiceArr.push("该砸盘了,该砸盘了,该砸盘了,该砸盘了");
          }
          this.playVoice()
      }, 4500))

    },
    checkfunstate(item) {
      item.ischeck = !item.ischeck
    },
    tableRowClassName({row, rowIndex}) {
      if (row.ischeck) {
        return 'success'
      }
      return '';
    },
    warningClass({row, rowIndex}) {
      if (row.isZB) {
        return 'warm'
      }
      return '';
    },
    DCDClass({row, rowIndex}) {
      if (row.DCD) {
        return 'warm'
      }
      return '';
    },

    open(link) {
      require('electron').shell.openExternal(link)
    },

    getHYlist() {


      this.$axios({
        method: 'post',
        url: 'https://pchq.kaipanla.com/w1/api/index.php',
        data: {
          c: 'PCArrangeData',
          a: 'GetZSIndexPlate',
          SelType: 2,
          ZSType: 4,
          PType: 2,
          POrder: 1,
          PStart: '',
          PEnd: '',
          PIndex: 0,
          Pst: 300
        }
      }).then(res => {

        var arr = [];
        for (var o of res.plates.list) {

          var o = {
            ischeck: false,
            data: o
          }
          arr.push(o)
        }

        this.list = arr;
      })
    },
    alertsss(num) {


      // this.$ipc.send('getlistData', 1);
      //  this.$ipc.send('yibu','走一遭22222222')

      // ipcRenderer.sendSync('asynchronous-message', '6666666666')// prints "pong"

    },
    initAudio() {
      // connect audio to the destination
      //const audio = this.$refs.audio;

      // const source = AC.createMediaElementSource(this.$refs.audio);
      // source.connect(analyser);
      // analyser.connect(gainnode);
      // gainnode.connect(AC.destination);
      //audio.play();

      // const source2 = AC.createMediaElementSource(this.$refs.audio2);
      // source2.connect(analyser);
      // analyser.connect(gainnode);
      // gainnode.connect(AC.destination);

      // audio.ontimeupdate = () => {
      //   clearTimeout(endTimeout);
      //   this.audioStatus.currentTime = audio.currentTime;
      //   const lessTime =
      //       this.audioStatus.duration - this.audioStatus.currentTime;
      //   // end event would not be fired while currentTime changed
      //   // so use timeout to fire end event.
      //   if (this.audioStatus.duration && lessTime < 5) {
      //     endTimeout = setTimeout(() => {
      //       onEnd();
      //     }, lessTime * 1000 + 100);
      //   }
      // };

      // audio.oncanplay = () => {
      //   this.audioStatus.duration = audio.duration;
      // };


    },
    rowClick(val) {

      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i][0] == val[0]) {
          this.multipleSelection.splice(i, 1)
          return;
        }
      }
      this.multipleSelection.push(val)
    },
    showdiag(val) {
      var code = val.data[0]

      if (code.substring(0, 2) == '60') {
        code = 'sh' + code
      }
      if (code.substring(0, 2) == '00') {
        code = 'sz' + code
      }
      this.chooseitem = 'http://image.sinajs.cn/newchart/daily/n/' + code + '.gif'
      this.dialogflag = true

    },

    handleSelectionChange(val) {

      this.multipleSelection = val;
    }
  },
  mounted() {


    this.getHYlist();
    //this.initAudio();
    // this.$ipc.on("yibu", (e, a) => {
    //       console.log(e, a);
    //     }
    // )
    // this.$ipc.send('getlistData', 1);
    // this.$ipc.on("getlistData", (e, a) => {
    //
    //   a = JSON.parse(a)
    //
    //   this.list = a.plates.list;
    // })
    // this.$parent.$ipc.on('asynchronous-reply', (event, arg) => {
    //   console.log("123123123")// prints "pong"
    // })

  },
  created() {
    window.myvue = this

  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

.lef_warp {
  display: flex;
  align-items: center
}

.lef_warp > * {
  margin-right: 16px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  background: radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
  );
  min-height: 90vh;
  padding: 24px;
  width: 100vw;

}

/deep/ .success {
  background: #F56C6C;
  color: #fff;
}

/deep/ .warm {
  background: #e6a23c;
  color: #fff;
}

main {
  display: flex;
  justify-content: space-between;
}

/deep/ .hide {
  display: none;
}
</style>
