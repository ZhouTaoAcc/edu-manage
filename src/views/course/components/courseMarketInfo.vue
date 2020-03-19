<template>
  <div class="courseMarketInfo">
    <el-form ref="marketForm"
             :model="marketForm"
             :rules="rules"
             label-width="100px">
      <el-form-item prop="charge" label="课程价格">
        <span v-for="item in chargeList">
          <el-radio
            :label="item.id"
            v-model="marketForm.charge"
            v-if="item.sdStatus==='1'"
          >{{item.sdName}}
          </el-radio>&nbsp;&nbsp;
        </span>
      </el-form-item>
      <el-form-item prop="price" label="金额(元)" v-if="isShowPrice">
        <el-input type="number" v-model="marketForm.price" placeholder="请输入课程价格"></el-input>
      </el-form-item>
      <el-form-item prop="valid" label="课程有效期">
        <span v-for="item in validList">
          <el-radio :label="item.id"
                    v-model="marketForm.valid"
                    v-if="item.sdStatus==='1'"
          >{{item.sdName}}</el-radio>&nbsp;&nbsp;
        </span>
      </el-form-item>
      <el-form-item label="过期时间"
                    v-if="isShowValid">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="qq" label="服务咨询QQ">
        <el-input v-model="marketForm.qq" placeholder="请输入服务咨询QQ"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="save()" :loading="editLoading">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {findDictionaryApi} from '../../../service/system'
  import {findCourseMarketInfoById, updateCourseMarketInfoApi} from '../../../service/course'
import moment from 'moment';
  export default {
    name: "courseMarketInfo",
    watch: {
      'marketForm.charge': {
        handler(val) {
          if (val === '203001') {//免费
            this.isShowPrice = false;
            //this.marketForm.price = 0;
          } else {
            this.isShowPrice = true;
          }
        },
        deep: true
      },
      'marketForm.valid': {
        handler(val) {
          if (val === '204001') {//永久有效
            this.isShowValid = false;
            this.marketForm.startTime=moment(new Date()).format('YYYY-MM-DD 00:00:00');
            this.marketForm.endTime = moment(new Date()).add(365*2, 'days').format('YYYY-MM-DD 23:59:59')
          } else {
            this.isShowValid = true;
          }
        },
        deep: true
      }
    },
    computed: {
      // 日期选择器默认日期
      dateRange: {
        get() {
          return [this.marketForm.startTime, this.marketForm.endTime];
        },
        set(val) {
          if (val === null) {
            this.marketForm.startTime = '';
            this.marketForm.endTime = '';
          } else {
            //日期选择器时间默认为date类型
            this.marketForm.startTime = new moment(val[0]).format('YYYY-MM-DD HH:mm:ss');
            this.marketForm.endTime = new moment(val[1]).format('YYYY-MM-DD HH:mm:ss');
          }
        }
      }
    },
    data() {
      return {
        courseid: '',
        editLoading: false,
        isShowPrice: true,
        isShowValid: true,
        priceOld: '',//原价格
        marketForm: {
          charge: '',
          valid: '',
          qq: '',
          price: '',//现价格
          startTime:'',
          endTime: ''
        },
        chargeList: [],//课程价格字典
        validList: [],//课程有效期字典
        rules: {
          charge: [
            {required: true, message: '请选择课程价格', trigger: 'blur'}
          ],
          valid: [
            {required: true, message: '请选择课程有效期', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      save() {
        this.$refs.marketForm.validate(valid => {
          this.editLoading = true;
          if (valid) {
            let params = {
              ...this.marketForm,
              priceOld: this.priceOld
            };
            updateCourseMarketInfoApi(this.courseid, params).then(res => {
              this.editLoading = false;
              if (res.success) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                });
              }
            })
          }
        })
      }
    },
    mounted() {
      /*查询数据字典*/
      //查询课程收费规则字典type=203
      findDictionaryApi('203').then(res => {
        this.chargeList = res.children;
      });
      //查询有效期字典type=204
      findDictionaryApi('204').then(res => {
        this.validList = res.children;
      });
      //回显营销信息
      this.courseid = this.$route.query.courseid;
      findCourseMarketInfoById(this.courseid).then(res => {
        if (!res) {
          this.$message.warning("暂无营销信息！")
        } else {
          this.marketForm = {...res};
          this.priceOld=res.price;
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/course/components/courseMarketInfo";
</style>
