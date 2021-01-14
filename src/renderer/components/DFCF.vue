<template>
  <div id="wrapper">

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
          <el-button type="primary" @click="checkHYall()">反选</el-button>
          <el-input plase="每行业读几条数据" v-model="GPCount"></el-input>
          <el-button type="primary" @click="saveHY()">保存</el-button>
        </div>
        <el-input placeholder="名字" v-model="searchName" style="width: auto"></el-input>


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
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column

            label="名字">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

      </el-table>


    </div>


    <div v-if="step==1">

      <el-button type="primary" @click="reset()">重新设置</el-button>
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="width: 48%">
          <div style="padding: 16px">
            涨停
          </div>
          <el-table :data="ZTBArr"
                    height="400px">
            <el-table-column
                prop="name"
                label="代码"
            >
              <template slot-scope="scope">{{ scope.row.data.code }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名字"
                width="180">
              <template slot-scope="scope">{{ scope.row.data.name }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="涨幅"
            >
              <template slot-scope="scope">{{ scope.row.data.changepercent }}</template>
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
        <div style="width: 48%">
          <div style="padding: 16px">
            即将涨停
          </div>
          <el-table :data="JJArr" height="400px">
            <el-table-column
                prop="name"
                label="代码"
            >
              <template slot-scope="scope">{{ scope.row.data.code }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名字"
                width="180">
              <template slot-scope="scope">{{ scope.row.data.name }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="涨幅"
            >
              <template slot-scope="scope">{{ scope.row.data.changepercent }}</template>
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

      <div style="display: flex;align-items: center;justify-content: space-between;margin-top: 16px">
        <div style="width: 48%">
          <div style="padding: 16px">
            炸板
          </div>
          <el-table :data="ZBArr"
                    height="400px">
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
    </div>
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


// gainnode.gain.value = 1;
export default {
  name: 'landing-page',
  data() {
    return {
      GPCount:3,
      searchName: '',
      voiceArr: [],
      oldZTBArr: [],//所有涨停过的股票
      ZBArr: [],//炸板arr
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
    checkHYall() {
      for (var o of this.list) {
        o.ischeck = !o.ischeck
      }


    },
    removeZT(code) {

      var flag = true
      for (var i in this.ZTBArr) {
        if (this.ZTBArr[i].data[0] == code) {
          this.ZTBArr[i].splice(i, 1)
        }
      }
    },
    removeJJZT(code) {

      var flag = true
      for (var i in this.JJArr) {
        if (this.JJArr[i].data.code == code) {
          this.JJArr[i].splice(i, 1)
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
        if (this.list[i].name.indexOf(this.searchName) != -1) {
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
    getGPList(HY) {


      this.$axios({
        method: 'get',
        url: 'http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=1&num='+this.GPCount+'&sort=changepercent&asc=0&node='+HY.code+'&symbol=&_s_r_a=sort',
        data: {

        }
      }).then(res => {

        let count = 0;
        for (var o of res) {
          count++
          if (o.code.indexOf('688') != -1 || o.code.indexOf('300') != -1) {
            continue;
          }

          let flag = true
          if (o.changepercent > 8) {
            var objtemp = {
              HY: HY.name,
              isbobao: false,
              isZT: false,
              isZB: false,
              PaiHang: count,
              data: o
            }



            //已涨停
            if (o.sell == 0 ) {//如果涨数为0就涨停
              flag = true

              //加入已经涨的数组
              for (var obj of this.oldZTBArr) {
                if (obj.data.code == o.code) {
                  flag = false
                }
              }
              if (flag) {
                this.oldZTBArr.push(objtemp)
              }


              flag = true


              //遍历涨停板判断是否在涨停板数组里
              for (var obj of this.ZTBArr) {
                if (obj.data.code == o.code) {
                  flag = false
                }
              }
              if (flag) {
                this.ZTBArr.push(objtemp)

               this.removeJJZT(objtemp.data.code)
              }
            } else {


              //炸板
              var oldZTBArrflag = false
              for (var obj of this.oldZTBArr) {
                if (obj.data.code == o.code) {
                  oldZTBArrflag = true
                }
              }
              if (oldZTBArrflag) {
                this.ZBArr.push(objtemp)
                this.voiceArr.push(objtemp.data.code + objtemp.data.name + '已炸板')
              } else {
                //即将涨停


                flag = true
                for (var obj of this.JJArr) {
                  if (obj.data.code == o.code) {
                    o.changepercent = obj.data.changepercent
                    flag = false
                  }
                }
                if (flag) {
                  this.JJArr.push(objtemp)
                  console.log(objtemp.data.code + objtemp.data.name)
                  this.voiceArr.push(objtemp.data.code + objtemp.data.name + '即将涨停')
                }
              }


            }


          } else {

            //踢出即将涨停
            //this.removeJJZT(o[0]);

            //踢出涨停
            //this.removeZT(o[0]);
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
      this.oldZTBArr = []
      this.ZBArr = []
      this.ZTBArr = []
      this.JJArr = []
      this.step = []
      this.checkHYlist = []
      var arrHY = []
      for (var o of this.IntervalArr) {
        clearInterval(o)
      }
      this.IntervalArr = []

      for (var o of this.list) {
        if (o.ischeck == true) {

          var code = o.code;
          arrHY.push(code)
          var that = this;
          (function (arg) {
            that.IntervalArr.push(
                setInterval(() => {
                  that.getGPList(arg)
                }, 5000)
            )
          })(o)


        }
      }
      if (arrHY.length == 0) {
        this.$alert("请先选择行业")
        return;
      }
      this.checkHYlist = arrHY;
      this.step = 1;


      this.IntervalArr.push(setInterval(() => {
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

    open(link) {
      require('electron').shell.openExternal(link)
    },

    getHYlist() {


      this.$axios({
        method: 'get',
        url: 'http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodes',
        data: {

        }
      }).then(res => {



        var HYarr=[]
        for(var o of res[1][0][1][2][1]){
          for(var j of o[1]){
            var temp={
              name:j[0],
              code:j[2],
              ischeck:false
            }
            HYarr.push(temp)
          }
        }


        this.list = HYarr;
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

  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
.lef_warp{
  display: flex;align-items: center
}
.lef_warp>*{
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

main {
  display: flex;
  justify-content: space-between;
}

/deep/ .hide {
  display: none;
}
</style>
