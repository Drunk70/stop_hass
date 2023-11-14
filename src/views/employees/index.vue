<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 页头组件 -->
      <PageTools :show-before="true">
        <template #before>
          <span>共有{{ page.total }} 个员工</span>
        </template>
        <template #after>
          <el-button type="primary" size="small" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button type="primary" size="small" @click="exportData">导出</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog = true ">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格数据 -->
      <el-card>
        <el-table
          v-loading="loading"
          :data="list"
          stripe
          border
        >
          <el-table-column type="index" align="center" label="序号" sortable="" />
          <el-table-column label="姓名" align="center" prop="username" sortable="" />
          <el-table-column label="手机号" align="center" prop="mobile" />
          <el-table-column width="120px" align="center" label="头像">
            <!-- 插槽 -->
            <!-- <template slot-scope="{ row }"> -->
            <template v-slot="{ row }">
              <img
                v-imagerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" align="center" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" align="center" prop="formOfEmployment" :formatter="formatEmployment" sortable="" />
          <el-table-column label="部门" align="center" prop="departmentName" sortable="" />
          <!-- 作用域插槽来做 + 过滤器 -->
          <el-table-column label="入职时间" align="center" prop="timeOfEntry" sortable="">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" prop="enableState" :formatter="formatEnableState" sortable="" />
          <el-table-column label="操作" align="center" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px;">
          <el-pagination
            :page-size="page.size"
            :total="page.total"
            :current-page="page.page"
            layout="total,prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <add-employee :show-dialog.sync="showDialog" />
      <!-- 分配角色组件 -->
      <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import Employees from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
import { formatDate } from '@/filters'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认是关闭的弹层
      // 分配角色弹窗
      showRoleDialog: false,
      // 角色弹窗传递id
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 点击分页页码
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 表格格式过滤
    formatEmployment(row, column, cellValue, index) {
      const obj = Employees.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    formatEnableState(row, column, cellValue, index) {
      return cellValue === 1 ? '可用' : '不可用'
    },
    // 删除按钮
    async delEmployee(id) {
      try {
        await this.$confirm('确认删除吗？')
        await delEmployee(id)
        this.$message.success('删除成功！')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async excel => {
        //  excel是引入文件的导出对象
        // 导出  header从哪里来
        // data从哪里来
        // 现在没有一个接口获取所有的数据
        // 获取员工的接口 页码 每页条数    100   1 10000
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data就是 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })

        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'],
        //   data: [['张三', 3000], ['李四', 5000]],
        //   filename: '员工工资表'
        // })
        // [{ username: '张三',mobile: 13112345678 }]  => [[]]
        // 要转化 数据结构 还要和表头的顺序对应上
        // 要求转出的标题是中文
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = Employees.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    },
    // 角色按钮
    async  editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetail(id)
      this.showRoleDialog = true
    }
  }
}
</script>

      <style>

      </style>

