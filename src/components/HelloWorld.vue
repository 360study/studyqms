<template>
  <div style="padding: 10px">
<el-card class="box-card">
  <div class="text item">
    <div><span style="font-size:30px;">ddddd</span></div>
    <div class="topFix">
      <el-input
        v-model="search"
        placeholder="请输入内容"
        clearable
        size="medium"
        class="input-with-select"
        @clear="resetEvent"
      >
        <el-select
          slot="prepend"
          v-model="rankValue"
          placeholder="请选择"
          clearable
          style="width: 120px; text-align: center"
          @change="searchEvent"
          @clear="resetEvent"
        >
          <el-option
            v-for="item in typeList"
            :key="item.label"
            :value="item.value"
            :label="`${item.label}`"
          ></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchEvent"
        ></el-button>
      </el-input>

      <vxe-toolbar
        ref="xToolbar"
        :refresh="{ queryMethod: reloadData }"
        print
        custom
        import
        export
        zoom
      >
        <template #buttons>
          <!-- <vxe-button @click="getAllEvent">获取所有</vxe-button>
          <vxe-button @click="getEditRecordEvent">获取选中</vxe-button>
          <vxe-button @click="getInsertEvent">获取新增</vxe-button>
          <vxe-button @click="getRemoveEvent">获取删除</vxe-button>
          <vxe-button @click="getUpdateEvent">获取修改</vxe-button> -->
          <el-button-group>
            <el-button @click="expandAllEvent()">展开</el-button>
            <el-button @click="clearExpandEvent()">关闭</el-button>
          </el-button-group>

          <el-button-group style="margin-left: 2px">
            <el-button type="info" @click="showWrongs">错题</el-button>
            <el-button type="info" @click="addWrongs">加入</el-button>
            <el-button type="success" @click="reLoad">重置</el-button>
          <!-- </el-button-group>

          <el-button-group style="margin-left: 2px">
            <el-button type="danger" @click="loadWrongs">错题本</el-button>
            <el-button type="danger" @click="saveWrongs">存错题</el-button>
          </el-button-group>
          <el-button-group style="margin-left: 2px"> -->
            <!-- 
            <el-button type="success" @click="readJindu">导进度</el-button>
            <el-button type="success" @click="saveData">存进度</el-button> -->
          </el-button-group>
          <el-radio-group
            v-model="moshi"
            style="padding-left: 2px"
            @change="handleChangeYangshi()"
          >
            <el-radio-button label="检测"></el-radio-button>
            <el-radio-button label="背题"></el-radio-button>
          </el-radio-group>
        </template>
      </vxe-toolbar>   
      <el-progress :percentage="progress" :format="format"></el-progress>

    </div>  
  </div>
</el-card>

    <div>
      <vxe-table
        ref="xTree"
        show-overflow
        keep-source
        :row-config="{ keyField: 'id', isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
        :print-config="{}"
        :export-config="{}"
        :loading="loading"
        :tree-config="{
          transform: true,
          rowField: 'id',
          parentField: 'parentId',
        }"
        :seq-config="{
          startIndex: 100,
          seqMethod: ({ row, rowIndex, column, columnIndex }) =>
            tablePage.sIndex + rowIndex + 1,
        }"
        :edit-config="{ trigger: 'dblclick', mode: 'row' }"
        :data="tableData"
        :sort-config="{
          iconAsc: 'vxe-icon-arrow-up',
          iconDesc: 'vxe-icon-arrow-down',
        }"
        :expand-config="{ trigger: 'row' }"
        :row-class-name="rowClassName"
        @edit-closed="editEvent"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column title="题目">
          <template #default="{ row }">
            <span
              style="color: rgb(206, 154, 11)"
              v-html="
                row.questionTypeId
                  .slice(2)
                  .replace('<p', '<span')
                  .replace('</p>', '</span>')
              "
            ></span>
            <span
              style="font-weight: bold"
              @dblclick="show(row)"
              v-html="
                row.stem.replace('<p', '<span').replace('</p>', '</span>')
              "
            ></span>
          </template>
        </vxe-column>
        <vxe-column field="questionType" title="类型" width="70">
          <template #default="{ row }">
            <span v-if="row.questionType.type == '0'">
              <!--0为单选-->
              <img
                src="./colorfull/shipped.svg"
                class="svgImg"
              />
            </span>
            <span v-else-if="row.questionType.type == '1'">
              <!--1为多选-->
              <img
                src="./colorfull/view_details.svg"
                class="svgImg"
              />
            </span>
            <span v-else>
              <!--5为判断-->
              <img
                src="./colorfull/inspection.svg"
                class="svgImg"
              />
            </span>
          </template>
        </vxe-column>
        <vxe-column type="expand" title="Details" width="80">
          <template #content="{ row }">
            <!-- <ul class="expand-answer">
            <li
              v-for="item in row.answerList"
              :key="item.option"
              @click="selectRow(row)"
            >
              <span class="chaoose-question-detail xy-center">
                <span>{{ item.option }}</span>
              </span>
              <span class="answer-content">{{ item.content }}</span>
            </li>
          </ul> -->
            <div>
              <!-- <span style="position: absolute; left: 5px; color: red">
              {{ row.questionTypeId }}
            </span> -->
              <!-- <div
              v-if="row.questionType.type == '1' && moshi == '检测'"
              style="position: absolute; left: 20px"
            >
              <span @click="showDuoxuan(row, $event)">
                <img
                  src="./colorfull/todo_list.svg"
                  style="height: 33px; margin-top: 5px"
                />
              </span>
            </div> -->
              <div style="position: absolute; top: 0px; left: 60px">
                <el-tooltip
                  :content="row.analysis.toString()"
                  placement="right-start"
                >
                  <span
                    v-if="row.answerRightFlag + '' == '1'"
                    @click="reAnswer(row)"
                  >
                    <img
                      src="./colorfull/approval.svg"
                      style="height: 33px; margin-top: 5px"
                    />
                  </span>
                  <span
                    v-else-if="row.answerRightFlag + '' == '2'"
                    @click="reAnswer(row)"
                  >
                    <img
                      src="./colorfull/disclaimer.svg"
                      style="height: 33px; margin-top: 5px"
                    />
                  </span>
                  <span v-else @click="showDuoxuan(row, $event)">
                    <img
                      src="./colorfull/idea.svg"
                      style="height: 33px; margin-top: 5px"
                    />
                  </span>
                </el-tooltip>
              </div>
              <div styl="float:left;display:flex;">
                <!--0为单选--,row.userAnswer-->
                <div
                  v-if="row.questionType.type == '0'"
                  @change="handleChange(row, row.userAnswer, $event)"
                >
                  <vxe-radio-group
                    v-model="row.userAnswer"
                    :disabled="row.okAnswer == '1' || moshi == '背题'"
                  >
                    <vxe-radio-button
                      v-for="item in row.answerList"
                      :key="item.option"
                      :label="item.option"
                      :class="[
                        'timu',
                        row.okAnswer == '1'
                          ? item.option == row.userAnswer
                            ? item.rightFlag == '1'
                              ? 'rightCss'
                              : 'wrong'
                            : item.rightFlag == '1'
                            ? 'AnswerRight'
                            : 'AnswerWrong'
                          : null,
                      ]"
                    >
                      <span>
                        <span class="chaoose-question-detail xy-center">
                          <span>{{ item.option }}</span>
                        </span>
                        <span
                          class="answer-content"
                          v-html="
                            item.content
                              .replace('<p', '<span')
                              .replace('</p>', '</span>')
                          "
                        ></span>
                      </span>
                    </vxe-radio-button>
                  </vxe-radio-group>
                </div>
                <!--1为多选--,row.collectFlag-->
                <div v-if="row.questionType.type == '1'">
                  <el-checkbox-group v-model="row.answerScore">
                    <el-checkbox
                      v-for="item in row.answerList"
                      :key="item.content"
                      :label="item.option"
                      :disabled="row.okAnswer == '1' || moshi == '背题'"
                      :class="[
                        row.okAnswer == '1'
                          ? row.answerScore.includes(item.option)
                            ? item.rightFlag == '1'
                              ? 'AnswerRight'
                              : 'AnswerWrong'
                            : item.rightFlag == '1'
                            ? 'Right'
                            : 'Wrong'
                          : null,
                      ]"
                    >
                      {{ item.option }}.
                      <span
                        v-html="
                          item.content
                            .replace('<p', '<span')
                            .replace('</p>', '</span>')
                        "
                      ></span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <!--5为判断--,row.collectFlag-->
                <div
                  v-if="row.questionType.type == '5'"
                  @change="handleChangeRadio(row, row.collectFlag, $event)"
                >
                  <el-radio-group
                    v-model="row.collectFlag"
                    :disabled="row.okAnswer == '1' || moshi == '背题'"
                  >
                    <el-radio-button
                      label="0"
                      :class="[
                        row.collectFlag == '0'
                          ? row.collectFlag == row.answerList[0].rightFlag
                            ? 'AnswerRight'
                            : 'AnswerWrong'
                          : null,
                      ]"
                    >
                      错误
                    </el-radio-button>
                    <el-radio-button
                      label="1"
                      :class="[
                        row.collectFlag == '1'
                          ? row.collectFlag == row.answerList[0].rightFlag
                            ? 'AnswerRight'
                            : 'AnswerWrong'
                          : null,
                      ]"
                    >
                      正确
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <!--使用 pager 插槽-->
      <vxe-pager
        :current-page="tablePage.currentPage"
        :page-size="tablePage.pageSize"
        :page-sizes="[
          10,
          20,
          100,
          500,
          { label: '大量数据', value: 1000 },
          { label: '全量数据', value: -1 },
        ]"
        :total="tablePage.total"
        :layouts="[
          'Sizes',
          'PrevJump',
          'PrevPage',
          'Number',
          'NextPage',
          'NextJump',
          'FullJump',
          'Total',
        ]"
        @page-change="handlePageChange"
      ></vxe-pager>
    </div>
    <wangEditor
      v-model="val1"
      :propData="propdata"
      :rowId="rowid"
      :propTitle="proptitle"
      :proptime="propTime"
      @item-click="saveAnalysis"
    ></wangEditor>
    <vxe-modal width="900" show-footer mask-closable>
      <template #title>
        <span style="color: red">{{ show_timu }}</span>
      </template>
      <template #corner>
        <vxe-icon name="bell-fill"></vxe-icon>
        <vxe-icon name="minus"></vxe-icon>
      </template>
      <template #default></template>
    </vxe-modal>
  </div>
</template>

<script>
const axios = require('axios').default
import VXETable from 'vxe-table'
const DATATABLE = {}
const QMSDATATABLE = {}
const SearchDATATABLE = {}
import { VxeTablePropTypes } from 'vxe-table'
import wangEditor from './wangEditor'
export default {
    name: 'UserManagement',
  components: {
     wangEditor, 
    },
    data() {
      return {
        showWrong: false, //显示错题本
        PS_ID: { type: '', jindu: '' },
        type: 0, //0正常模式，1错题模式。
        wrongFlag: false,
        rowClass: '',
        propTime: '',
        porpObj: {},
        show_timu: '',
        refList: [],
        val1: false,
        propdata: '',
        rowid: '',
        proptitle: '',
        progress: 0,
        moshi: '检测',
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 100,
          sIndex: 1,
        },
        showfiles: false,
        fileDetal: {},
        PIC_Type: 'this.$route.name',
        rankValue: '',
        search: '',
        queryForm: {
          name: '',
        },
        formData: { name: '' },
        typeList: [
          { value: '', label: '全部' },
          { value: '0', label: '单项选择题' },
          { value: '1', label: '多项选择题' },
          { value: '5', label: '判断题' },
        ],
        loading: false,
        xTable: null,
        tableData: [],
        list: null,
        listLoading: true,
        total: this.list == null ? 0 : this.list.length,
        elementLoadingText: '正在加载...',
        treeConfig: {
          transform: true,
          iconOpen: 'vxe-icon-square-minus',
          iconClose: 'vxe-icon-square-plus',
        },
        //试题相关data
        originDataJson: null,
        originData: null,
        questionData: {
          lx: null,
          bt: null,
          jc: null,
        },
        chapterId: '',
        categoryId: '',
        questionId: '',
        nowIndex: 0,
        workType: null,
        workTypeBak: null,
        questionTypes: '',
        flag: {
          fetchQuestion: !1,
        },
        showAnswer: false,
        chooseType: '',
        chapterData: {},
        workTypes: [
          {
            key: 'lx',
            name: '练习模式',
          },
          {
            key: 'bt',
            name: '背题模式',
          },
          {
            key: 'jc',
            name: '检测模式',
          },
        ],
      }
    },
 watch: {},
    async created() {
      // if (this.$store.state.qms.xiangmu == '') {
      //   //如果没有选择评审任务就返回到首页
      //   await this.$store.dispatch('qms/setXiangmu', { type: '', jindu: '0' })
      //   // 将表格和工具栏进行关联
      //   const $table = this.$refs.xTree
      //   const $toolbar = this.$refs.xToolbar
      //   if ($table && $toolbar) {
      //     $table.connect($toolbar)
      //   }
      //   return new Promise(() => {
      //     setTimeout(() => this.fetchData(), 800)
      //   })
      // }
      // //this.fetchData()
      // this.$nextTick(() => {
      //   //this.checkNodes = this.$refs.demoTree.getCheckedNodes()
      //   this.fetchData()
      // })
    },
    async mounted() {
      //qqq + 1
      console.log('mounted')
      // let t = this.fetchData().then((res) => {
      //   QMSDATATABLE._data = JSON.parse(JSON.stringify(res))
      //   // DATATABLE._data = JSON.parse(JSON.stringify(_data))
      //   // SearchDATATABLE._data = JSON.parse(JSON.stringify(_data))
      //   let data = ''
      //   this.type == 0
      //     ? (data = this.unique(SearchDATATABLE._data, 'stem'))
      //     : type == 1
      //     ? (data = this.unique(SearchDATATABLE._data, 'stem').filter(
      //         (item) => item.answerRightFlag.toString() === '2'
      //       ))
      //     : ''
      //   console.log(data)
      //   this.loading = false
      // })
      // console.log('mounted1')
      // console.log(t)
      let data = ''
      let res = await this.readDataBase()
      this.fetchData()
    },
    methods: {
      goBack() {
        console.log('go back');
      },
      async readDataBase() {
        const _that = this
        const Data = {}
        //远程读取数据
        //Data.MingXi = Data.MingXi = 'http://117.160.199.82:7777/QEM/QMS/qms'
        Data.MingXi = 'http://localhost:3000/qms'
        if (this.PS_ID.type == 'OHMS')
          Data.MingXi = 'http://117.160.199.82:7777/QEM/OHMS/ohms'
        if (this.PS_ID.type == 'ISMS')
          Data.MingXi = 'http://117.160.199.82:7777/QEM/ISMS/isms'
        //远程读取数据
        //if (PS_ID.jindu == '1') Data.MingXi += '_s.txt'
        //else if (PS_ID.jindu == '2') Data.MingXi += '_wrongs.txt'
        //else Data.MingXi += '.txt'
        if (this.PS_ID.jindu == '1') Data.MingXi = 'http://localhost:3000/qms'
        else if (this.PS_ID.jindu == '2')
          Data.MingXi = 'http://localhost:3000/wrongs'
        const _tableData = await axios
          .get(Data.MingXi + '?timestamp=' + Date.now(), {
            responseType: 'arraybuffer',
          })
          .then((res) => {
            // 明确指定 utf-8 格式解码
            const text = new TextDecoder('utf-8').decode(res.data)
            console.log(text)
            const _data = JSON.parse(text)
            return _data
          })
        let data = ''
        this.type == 0
          ? (data = this.unique(_tableData, 'stem'))
          : type == 1
          ? (data = this.unique(_tableData, 'stem').filter(
              (item) => item.answerRightFlag.toString() === '2'
            ))
          : ''
        console.log('jingjian-data')
        console.log(data)
        QMSDATATABLE._data = JSON.parse(JSON.stringify(data))
        DATATABLE._data = JSON.parse(JSON.stringify(data))
        SearchDATATABLE._data = JSON.parse(JSON.stringify(data))
      },
      async fetchData() {
        const that = this
        that.loading = true
        let data = (SearchDATATABLE._data =
          that.search || this.rankValue || this.showWrong
            ? QMSDATATABLE._data
            : DATATABLE._data)
        if (!data) await this.readDataBase()
        this.pageData()
        that.loading = false
      },

      saveAnalysis(item) {
        console.log('cpnClick', item)
        let _row = SearchDATATABLE._data.find((_item) => {
          return _item.id == item.id
        })
        _row.analysis = item.data
        this.updateDb(_row)
        this.val1 = false
      },
      setItemRef(el) {
        this.refList.push(el)
        console.log('el')
        console.log(el)
      },
      handleClick(tab) {
        this.activeName = tab.index
        this.refList[tab.index].load()
      },
      show(row) {
        console.log(row)
        console.log(this.refList)
        this.val1 = true
        this.show_timu = row.stem
        this.propdata = row.analysis
        this.proptitle = row.stem
        this.rowid = row.id
        this.propTime = new Date() + ''
      },
      // openAlert(options) {
      //   VXETable.modal.alert(options)
      // },
      // openAlert(options) {
      //   this.$alert(options.content, '题目解析', {
      //     dangerouslyUseHTMLString: false,
      //     closeOnClickModal: true,
      //   })
      // },
      // openAlert(options) {
      //   this.$prompt('请输入邮箱', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     inputValue: options.content,
      //     inputType: 'text',
      //   })
      //     .then(({ value }) => {
      //       this.$message({
      //         type: 'success',
      //         message: '你的邮箱是: ' + value,
      //       })
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '取消输入',
      //       })
      //     })
      // },
      //重新导入数据
      async reLoad() {
        let _that = this
        _that.tableData = []
        _that.loading = true
        _that.wrongFlag = false
        DATATABLE._data = []
        QMSDATATABLE._data = []
        SearchDATATABLE._data = []
        this.PS_ID = { type: '', jindu: '' }
        await this.readDataBase()
        _that.fetchData()
        _that.loading = false
      },
      //导入错题本
      async loadWrongs() {
        const type = await VXETable.modal.confirm(
          '您确定要导入错题吗，会覆盖现在进度，开始之前请保存进度？'
        )
        if (type == 'confirm') {
          // let _that = this
          // _that.wrongFlag = true
          // _that.PS_ID.jindu = '2'
          // _that.loading = true
          // await _that.readDataBase()
          // _that.fetchData()
          // _that.$refs.xTree.updateData()
          // _that.loading = false
          this.showWrong = true
          await this.searchEvent()
        }
      },
      //题库去重=====先用unique方法按id筛选数据，然后保存
      async saveWrongs() {
        this.$message({
          message: '提示信息，远程时有效，本地可忽略此信息！',
          type: 'success',
          duration: 600,
        })
        // let data = this.unique(SearchDATATABLE._data, 'id')
        // if (data.length > 0) {
        //   this.loading = true
        //   let forms = new FormData()
        //   forms.append('type', 'QMS')
        //   forms.append('MingXi', JSON.stringify(data))
        //   const { _data } = await axios({
        //     method: 'post',
        //     url: 'http://117.160.199.82:7777/anbiao_bg.ashx?type=saveWrongs', //请求地址
        //     data: forms, //表单序列化
        //   }).then((response) => {
        //     // Handle response
        //     console.log('response.data')
        //     console.log(response.data)
        //     console.log('response.data')
        //     this.$message({
        //       message: '错题保存成功！',
        //       type: 'success',
        //       duration: 600,
        //     })
        //     this.loading = false
        //     return response.data
        //   })
        // }
      },

      /**
       * 根据数组对象的某个字段去重
       * item.name  是[{name:1}] 根据每条数据的name值来去重
       * */
      unique(arr, val) {
        const res = new Map()
        //return arr || [] //因为已经筛选过了，db.json中只有958条，所以不需要重复过滤了
        return !arr
          ? []
          : arr.filter(
              // (item) =>
              //   ![...res.keys()].some((_item) => item == item[val]) &&
              //   res.set(item[val], 1)
              (item) =>
                ![...res.keys()].some(
                  (_item) =>
                  _item == item[val]
                  //去除重复度达到80以上的项目
                  //this.compare(_item, item[val]) > 80 //共958条，已保存在db.json，oshm 1068条
                ) && res.set(item[val], 1)
            )
      },
      //保存错题，将错题插入到错题本中
      async addWrongs() {
        this.loading = true

        const _wrongsData = await axios({
          method: 'get',
          //请求地址远程地址
          // url: 'http://117.160.199.82:7777/anbiao_bg.ashx?type=addWrongs',
          // data: data, //forms，远程用forms传输数据
          // 本地数据库存public/static/data/db.json
          url: 'http://localhost:3000/wrongs',
        })

        const data = SearchDATATABLE._data.filter(
          (item) => item.answerRightFlag.toString() === '2'
        )
        if (data.length == 0) {
          this.$message({
            message: '暂无错题',
            type: 'success',
            duration: 600,
          })
          this.loading = false
          return
        }
        //此段代码只在localhost中使用，根据id判断是否存在wrongs中，如果存在则修改，如果不存在则新增
        let _addData = [],
          _updateData = []
        data.forEach((item) => {
          _wrongsData.data.some((_item) => _item.id == item.id)
            ? _updateData.push(item)
            : _addData.push(item)
        })
        this.$message({
          message: '正在努力添加中',
          type: 'success',
          duration: 600,
        })
        await this.updatePromise(_updateData,'put')
        await this.updatePromise(_addData,'post')
        this.loading = false
        this.$message({
          message: '添加错题完成！',
          type: 'success',
          duration: 600,
        })
      },
      //逐个修改
      async updatePromise(_addDatas,type){
        // 在远程代码时，用data代替_addData，远程代码是直接覆盖原文件的内容
        if(_addDatas.length === 0) return;
        const item = _addDatas[0]
        let _url = 'http://localhost:3000/wrongs'
        type == 'put' ? _url += '/' + item.id : ''
        _url  += '?timestamp=' + Date.now()
        let respose = await axios({
              method: type,
              //请求地址远程地址
              // url: 'http://117.160.199.82:7777/anbiao_bg.ashx?type=addWrongs',
              // data: data, //forms，远程用forms传输数据
              // 本地数据库存public/static/data/db.json
              url: _url.toLowerCase(),
              data: item, //表单序列化
              headers: {
              'Content-Type': 'application/json; charset=utf-8',
              },
              success: function (data) {
                console.log(data)
              },
              error: function (data) {
                console.log('wrong data')
                console.log(data)
              },
            })
        _addDatas.shift()
        await this.updatePromise(_addDatas)
      },

      //  async updatePromise_all(_addDatas,type){
      //   // 在远程代码时，用data代替_addData，远程代码是直接覆盖原文件的内容
      //   let promises = []
      //   if(_addDatas.length === 0) return;
      //   const item = _addDatas[0]
      //   let _url = 'http://localhost:3000/wrongs'
      //   type == 'put' ? _url += '/' + item.id : ''
      //   _url  += '?timestamp=' + Date.now()
      //   for (let i = 0; i < _addDatas.length; i++) {
      //     const promise = await axios({
      //         method: type,
      //         //请求地址远程地址
      //         // url: 'http://117.160.199.82:7777/anbiao_bg.ashx?type=addWrongs',
      //         // data: data, //forms，远程用forms传输数据
      //         // 本地数据库存public/static/data/db.json
      //         url: _url.toLowerCase(),
      //         data: item, //表单序列化
      //         headers: {
      //         'Content-Type': 'application/json; charset=utf-8',
      //         }
      //       })
      //     promises.push(promise)
      //    }
      //   await Promise.all(promises)
      // },     
      rowClassName({ row, rowIndex }) {
        return row.answerRightFlag == '1'
          ? 'row-right'
          : row.answerRightFlag == '2'
          ? 'row-wrong'
          : null
      },
      //读取进度
      async readJindu() {
        const type = await VXETable.modal.confirm(
          '您确定要导入进度吗，会覆盖现在进度？'
        )
        if (type == 'confirm') {
          this.reloadData()
        }
      },
      reloadData() {
        this.reload()
      },
      //保存进度，远程数据时启用，本地数据直接
      async saveData() {
        this.$message({
          message: '保存进度成功！',
          type: 'success',
          duration: 600,
        })
        //在远程数据时使用，本地数据直接保存进度
        // const type = await VXETable.modal.confirm(
        //   '您确定要保存吗，会覆盖原进度的？'
        // )
        // if (type == 'confirm') {
        //   //VXETable.modal.message({ content: `点击了 ${type}，正在保存中！` })
        //   this.loading = true
        //   let data = SearchDATATABLE._data || []
        //   console.log(data)
        //   let forms = new FormData()
        //   forms.append('type', 'QMS')
        //   forms.append('MingXi', JSON.stringify(data))
        //   const { _data } = await axios({
        //     method: 'post',
        //     url: 'http://117.160.199.82:7777/anbiao_bg.ashx?type=saveJindu', //请求地址
        //     data: forms, //表单序列化
        //   }).then((response) => {
        //     // Handle response
        //     console.log('response.data')
        //     console.log(response.data)
        //     console.log('response.data')
        //     this.$message({
        //       message: '保存进度成功！',
        //       type: 'success',
        //       duration: 600,
        //     })
        //     return response.data
        //   })
        //   // setTimeout(() => {
        //   //   this.fetchData()
        //   // }, 800)
        //   //console.log(JSON.stringify(data))
        //   this.loading = false
        // }
      },
      //显示错题
      showWrongs() {
        this.showWrong = true
        this.searchEvent()
      },
      //重置okAnswer标志，重做
      reAnswer(row) {
        row.okAnswer = 0
        row.answerScore = []
        row.userAnswer = ''
        row.collectFlag = ''
        row.answerRightFlag = ''
      },
      //判断答题进度
      getPprogress() {
        let questionList = SearchDATATABLE._data || []
        let qustions = questionList.length
        let answered = questionList.filter(function (q) {
          return q.okAnswer
        }).length
        this.progress =
          qustions == 0 ? 0 : ((100 * answered) / qustions).toFixed(1) - 0
      },
      //问题列表从nowQuestionData中获取questionList,如果workType不存在则默认为[]。
      questionList() {
        return SearchDATATABLE._data || []
      },

      //选出okAnswer(答题标志)的数组，并计算其长度
      questionQuantity() {
        return
      },
      //格式化progress进度条显示文本
      format(percentage) {
        return percentage === 100 ? '完成测试' : `${percentage}%`
      },
      //展开所有
      expandAllEvent() {
        const $table = this.$refs.xTree
        if ($table) {
          $table.setAllRowExpand(true)
        }
      },

      clearExpandEvent() {
        const $table = this.$refs.xTree
        if ($table) {
          $table.clearRowExpand()
        }
      },
      //查找事件
      async searchEvent() {
        const filterVal = String(this.search).trim().toLowerCase()
        let _DATA = JSON.parse(JSON.stringify(DATATABLE._data))
        let _tempData = JSON.parse(JSON.stringify(DATATABLE._data))
        let _data = JSON.parse(JSON.stringify(DATATABLE._data))
        if (this.showWrong)
          _DATA = _data.filter((item) => item.answerRightFlag + '' == '2')
        const searchProps = ['stem']
        _tempData = _DATA
        if (this.rankValue || filterVal) {
          if (this.rankValue)
            _tempData = _DATA.filter((item) =>
              !['5', '0', '1'].includes(this.rankValue)
                ? !0
                : item.questionType.type === this.rankValue
            )
          if (filterVal) {
            const filterRE = new RegExp(filterVal, 'gi')
            const _Tdata = _tempData.filter((item) =>
              searchProps.some(
                (key) => String(item[key]).toLowerCase().indexOf(filterVal) > -1
              )
            )
            _tempData = _Tdata.map((row) => {
              const item = Object.assign({}, row)
              searchProps.forEach((key) => {
                item[key] = String(item[key]).replace(
                  filterRE,
                  (match) => `<span class="keyword-lighten">${match}</span>`
                )
              })
              return item
            })
          }
        } //ttt + 0

        //this.tableData = _tempData
        QMSDATATABLE._data = _tempData
        await this.fetchData()
        //this.fetchData()
      },
      pageData() {
        let data = JSON.parse(JSON.stringify(SearchDATATABLE._data))
        const that = this
        let obj = {
          page: {
            total: data.length,
          },
          result: data.slice(
            (that.tablePage.currentPage - 1) * that.tablePage.pageSize,
            that.tablePage.currentPage * that.tablePage.pageSize
          ),
          sIndex: (that.tablePage.currentPage - 1) * that.tablePage.pageSize,
        }
        that.tableData = obj.result
        that.tablePage.total = obj.page.total
        that.tablePage.sIndex = obj.sIndex
        that.$message({
          message: '载入数据完成',
          type: 'success',
          duration: 600,
        })
      },
      //单选, row.userAnswer，string,handleChange
      //多选, row.answerScore,数组,showDuoxuan
      //判断, row.collectFlag,string,handleChangeRadio
      handleChange(row, userAnswer, event) {
        let tip = 'ok'
        let height = event.target.getClientRects()[0].y
        row.answerRightFlag = 0
        //row.analysis = ''
        row.userAnswer = userAnswer
        console.log('row')
        console.log(row)
        console.log(userAnswer)
        row.okAnswer = 1
        let rightAnswer = row.answerList
          .filter(function (a) {
            return '1' === a.rightFlag
          })
          .map(function (t) {
            return t.option
          })

        if (
          (userAnswer || '').split('|').sort().toString() ===
          rightAnswer.sort().toString()
        ) {
          console.log('Right')
          this.rowClass = 'row-right'
          row.answerRightFlag = 1
          //row.analysis = rightAnswer.sort().toString()
          this.$notify({
            //title: '正确',
            dangerouslyUseHTMLString: true,
            message: `回答正确！<span style='color:blue;font-weight:bold'> ${rightAnswer}</span> `,
            type: 'success',
            offset: height,
          })
        } else {
          console.log('wrong')
          this.rowClass = 'row-wrong'
          row.answerRightFlag = 2
          this.$notify({
            dangerouslyUseHTMLString: true,
            message: `正确答案是<span style='color:red;font-weight:bold'> ${rightAnswer}</span> `,
            type: 'error',
            offset: height,
          })
          tip = 'wrong'
        }
        return new Promise((resolve, reject) => {
          setTimeout(resolve(tip), 1000)
        }).then((res) => {
          console.log(res)
          this.updateDb(row)
          this.getPprogress()
        })
      },
      //单选, row.userAnswer，string,handleChange
      //多选, row.answerScore,数组,showDuoxuan
      //判断, row.collectFlag,string,handleChangeRadio
      showDuoxuan(row, event) {
        console.log(row.answerScore)
        let tip = 'ok'

        if (!row.answerScore || row.answerScore.length == 0)
          this.$notify({
            message: '尚未作答',
            type: 'warning',
            duration: 800,
            type: 'error',
            offset: event.pageX,
          })
        else {
          if (row.okAnswer != '1') {
            row.okAnswer = 1
            let rightAnswer = row.answerList
              .filter(function (a) {
                return '1' === a.rightFlag
              })
              .map(function (t) {
                return t.option
              })
            if (
              row.answerScore.sort().toString() ===
              rightAnswer.sort().toString()
            ) {
              console.log('Right')
              row.answerRightFlag = 1
              this.$notify({
                //title: '正确',
                dangerouslyUseHTMLString: true,
                message: `回答正确！<span style='color:blue;font-weight:bold'> ${rightAnswer}</span> `,
                type: 'success',
                offset: event.pageX,
              })
            } else {
              console.log('wrong')
              row.answerRightFlag = 2
              tip = 'wrong'
              this.$notify({
                dangerouslyUseHTMLString: true,
                message: `正确答案是<span style='color:red;font-weight:bold'> ${rightAnswer}</span> `,
                type: 'error',
                offset: event.pageX,
              })
            }
          } else this.reAnswer(row)
        }
        return new Promise((resolve, reject) => {
          setTimeout(resolve(tip), 1000)
        }).then((res) => {
          console.log(res)
          this.updateDb(row)
          this.getPprogress()
        })
      },
      //单选, row.userAnswer，string,handleChange
      //多选, row.answerScore,数组,showDuoxuan
      //判断, row.collectFlag,string,handleChangeRadio
      handleChangeRadio(row, collectFlag, event) {
        let tip = 'ok'
        let height = event.target.getClientRects()[0].y
        let rightAnswer = row.answerList[0].rightFlag
        row.okAnswer = 1
        if (collectFlag === rightAnswer) {
          console.log('Right')
          row.answerRightFlag = 1
          this.$notify({
            //title: '正确',
            dangerouslyUseHTMLString: true,
            message: `回答正确！<span style='color:blue;font-weight:bold'> ${
              rightAnswer == '0' ? '错误' : '正确'
            }</span> `,
            type: 'success',
            offset: height,
          })
        } else {
          console.log('wrong')
          tip = 'wrong'
          row.answerRightFlag = 2
          this.$notify({
            dangerouslyUseHTMLString: true,
            message: `正确答案是<span style='color:red;font-weight:bold'> ${
              rightAnswer == '0' ? '错误' : '正确'
            }</span> `,
            type: 'error',
            offset: height,
          })
        }
        return new Promise((resolve, reject) => {
          setTimeout(resolve(tip), 1000)
        }).then((res) => {
          console.log(res)
          this.updateDb(row)
          this.getPprogress()
        })
      },
      async updateDb(row) {
        if (row) {
          let _url = this.wrongFlag
            ? 'http://localhost:3000/wrongs/'
            : 'http://localhost:3000/qms/'
          _url += row.id + '?timestamp=' + Date.now()
          row.stem = row.stem.replace(/(<(.*?)?>)/g, '')
          const _data = await axios({
            method: 'put',
            url: _url,
            data: row, //表单序列化，注意是用data关键字，否则会出错！
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          })
          console.log(_data)
          _data.status == 200
            ? this.$message({
                message: row.id + '修改成功！',
                type: 'success',
                duration: 600,
              })
            : this.$message({
                message: row.id + '修改失败',
                type: 'danger',
                duration: 600,
              })
        } else
          this.$message({
            message: row.id + '修改失败',
            type: 'danger',
            duration: 600,
          })
      },
      //更改答题模式，背题和检测两种
      async handleChangeYangshi() {
        console.log(this.moshi)
        this.wrongFlag = false
        const Obj = SearchDATATABLE._data
        //ttt + 0
        var _timu = {}
        _timu = JSON.parse(JSON.stringify(Obj))
        if (this.moshi == '背题') {
          //console.log(SearchDATATABLE._data)
          _timu.forEach((element) => {
            if (element.questionType.type == '0') {
              element.userAnswer = element.answerList.filter(
                (t) => t.rightFlag == '1'
              )[0].option
            }
            if (element.questionType.type == '1') {
              let _array = []
              element.answerList
                .filter((t) => t.rightFlag == '1')
                .forEach((item) => _array.push(item.option))
              element.answerScore = _array
            }
            if (element.questionType.type == '5') {
              element.collectFlag = element.answerList[0].rightFlag
            }
            element.answerRightFlag = '1'
          })
          console.log('_timu')
          console.log(_timu)
          SearchDATATABLE._data = _timu
          this.findList()
        }
        if (this.moshi == '检测') {
          SearchDATATABLE._data = Obj
          this.findList()
        }
      },
      coppyArray(arr) {
        return arr.map((e) => {
          if (typeof e === 'object') {
            return Object.assign({}, e)
          } else {
            return e
          }
        })
      },
      selectRow(row) {
        console.log('row')
        console.log(row)
        if (row.questionType.type === '0') {
        }
      },
      queryData() {
        this.fetchData()
      },

      linkto(userId) {
        if (userId != this.PIC_Type) router.push(`/qms/${userId}`)
      },
      searchMethod() {
        const $table = this.$refs.xTree
        if ($table) {
          // 清除所有状态
          $table.clearAll()
          return findList()
        }
        return Promise.resolve()
      },
      showFiles() {},
      filterRankMethod() {},
      async insertRow(currRow, locat) {},
      async removeRow(row) {},
      async insertEvent() {},
      getInsertEvent() {},
      getEditRecordEvent() {},
      getRemoveEvent() {},
      async saveEvent() {},
      getUpdateEvent() {},
      editEvent({ row, column }) {},
      resetEvent() {
        this.searchEvent()
      },
      nextTick() {
        // 将表格和工具栏进行关联
        const $table = this.$refs.xTree
        const $toolbar = this.$refs.xToolbar
        if ($table && $toolbar) {
          $table.connect($toolbar)
        }
        findList()
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.pageData()
      },
      //
      findListPages() {
        const that = this
        that.tableData = DATATABLE._data.slice(
          (that.tablePage.currentPage - 1) * that.tablePage.pageSize,
          that.tablePage.currentPage * that.tablePage.pageSize
        )
        that.tablePage.sIndex =
          (that.tablePage.currentPage - 1) * that.tablePage.pageSize
      },

      compare(_x = [], _y = []) {
        let x = Array.from(_x)
        let y = Array.from(_y)
        var z = 0
        var s = x.length + y.length

        x.sort()
        y.sort()
        var a = x.shift()
        var b = y.shift()

        while (a !== undefined && b !== undefined) {
          if (a === b) {
            z++
            a = x.shift()
            b = y.shift()
          } else if (a < b) {
            a = x.shift()
          } else if (a > b) {
            b = y.shift()
          }
        }
        return (z / s) * 200
      },
    },
  }
</script>
<style scoped>
  ul {
    list-style-type: none;
    padding: 0px;
    margin: 0px;
  }

  li {
    display: block;
    color: #000;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
  }

  li .title {
    color: red;
  }

  li:hover {
    background-color: rgb(240, 240, 238);
  }

  .svgImg {
    height: 20px;
  }

  .expand-answer {
    display: inline-flex;
    line-height: 46px;
    height: 46px;
  }

  .expand-answer li {
    margin: auto;
    padding-left: 20px;
    display: flex;
  }

  .chaoose-question-detail {
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    border: 0.04rem solid #c4c4c4;
    margin: 0 5px;
  }

  .expand-answer li:hover .chaoose-question-detail {
    color: yellow;
    border: 0.04rem solid #164de2;
    background-color: rgba(255, 0, 0, 0.529);
  }

  .xy-center,
  .yx-center {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .chaoose-question-detail .right {
    border-color: #58c69c;
    background-color: #58c69c;
    color: #58c69c;
  }

  .chaoose-question-detail .error {
    background-color: #ff4d24;
    border-color: #ff4d24;
    color: #ff4d24;
  }
</style>
<style>
  .vxe-body--expanded-cell {
    padding-left: 130px !important;
    line-height: 46px !important;
    min-height: 46px !important;
    background-color: rgb(238, 245, 249);
    word-wrap: auto !important;
    overflow: visible !important;
    white-space: normal !important;
  }

  .expand-answer li:hover {
    color: blue;
    font-weight: bolder;
    background-color: rgba(255, 255, 255, 0);
  }

  .row--current {
    font-weight: bolder;
    color: #f00;
  }

  .rightCss .vxe-radio--label {
    background-color: rgb(60 165 12) !important;
    border-color: rgb(60 165 12) !important;
    box-shadow: rgb(3, 117, 90) !important;
  }

  .rightCss .chaoose-question-detail {
    background-color: white;
    border-color: rgb(60 165 12) !important;
    color: rgb(60 165 12) !important;
    font-weight: bold;
  }

  .wrong .vxe-radio--label {
    background-color: rgb(243, 75, 19) !important;
    border-color: rgba(249, 69, 33, 0.879) !important;
    box-shadow: rgb(255, 255, 255) !important;
    font-weight: bold;
  }

  .wrong .answer-content {
    color: rgb(255, 255, 255);
  }

  .wrong .chaoose-question-detail {
    background-color: white !important;
    border-color: rgb(252, 0, 0);
    color: red;
  }

  .keyword-lighten {
    color: red;
    background-color: yellow;
    font-weight: bold;
  }

  .el-input--medium .el-input__inner {
    height: 46px !important;
  }

  .row-right {
    background-color: rgb(216, 246, 247);
    color: blue !important;
  }

  .row-wrong {
    background-color: rgba(252, 183, 165, 0.649);
    padding: 5px;
    color: red !important;
  }

  .is-checked .el-checkbox__label {
    color: #129f01 !important;
    /* font-weight: bold; */
  }

  .is-checked .el-checkbox__inner {
    background-color: #129f01 !important;
  }

  .wrong .el-checkbox__label {
    color: #f54848 !important;
    /* font-weight: bold; */
  }

  .Wrong .el-checkbox__inner {
    border-color: #d1cece !important;
    /* font-weight: bold; */
  }

  .AnswerWrong .el-radio-button__inner {
    border-color: #d1cece !important;
    background-color: red !important;
    color: white !important;
    /* font-weight: bold; */
  }

  .AnswerWrong .vxe-radio--label {
    color: rgb(137, 146, 155) !important;
  }

  .AnswerRight .el-radio-button__inner,
  .AnswerRight .xy-center {
    border-color: #129f01 !important;
    background-color: #129f01 !important;
    color: white !important;
    /* font-weight: bold; */
  }

  .AnswerRight .vxe-radio--label {
    color: #129f01 !important;
  }

  /* font-weight: bold; */

  .Right .el-checkbox__label {
    color: #129f01 !important;
    /* font-weight: bold; */
  }

  .Right .el-checkbox__inner {
    border-color: #049f01 !important;
    /* font-weight: bold; */
  }

  .Wrong .el-radio-button__inner {
    border-color: #d1cece !important;
    background-color: red !important;
    color: white;
    /* font-weight: bold; */
  }

  .AnswerWrong .el-checkbox__inner {
    border-color: #ff0202 !important;
    background-color: red !important;
    color: rgb(252, 252, 252) !important;
    /* font-weight: bold; */
  }

  .AnswerWrong .el-checkbox__label {
    color: rgb(247, 123, 123) !important;
    /* font-weight: bold; */
  }

  .rightAnswerCss.el-checkbox__input {
    color: #010b9f !important;
    /* font-weight: bold; */
  }

  .rightAnswerCss.el-checkbox__label {
    color: #0313f3 !important;
    /* font-weight: bold; */
  }

  .topFix {
    /*
    position: fixed;
    top: 120px;
    z-index: 99;
    width: 87%;
    */
  
  }
  .clearfix{
    float: left;
  }
</style>