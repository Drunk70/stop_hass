<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async  success({ header, results }) {
      if (this.type === 'user') {
        if (this.type === 'user') {
          const userRelations = {
            '入职日期': 'timeOfEntry',
            '手机号': 'mobile',
            '姓名': 'username',
            '转正日期': 'correctionTime',
            '工号': 'workNumber'
          }
          var newArr = results.map(item => {
            var userInfo = {}
            Object.keys(item).forEach(key => {
              if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              // 后端接口 限制了 不能是字符串 要求转化时间类型
                userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样 才能存入数据库
              } else {
                userInfo[userRelations[key]] = item[key] // 将原来中文对应的值 赋值给原来英文对应的值
              }
            })
            return userInfo
          })
          await importEmployee(newArr) // 接收一个数组
          this.$message.success('导入excel成功')
          this.$router.back() // 回到上一个页面
        }
      }
    },
    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
