<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片 -->
      <el-card class="card">
        <!-- 标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织架构" name="first" class="tabpane">
            <!-- 公司名 -->
            <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
            <!-- 树形控件 -->
            <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
              <TreeTools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <AddDept ref="addDepts" :show-dialog.sync="showDialog" :tree-node="node" @upDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/adddept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      activeName: 'first', // 标签页
      company: {}, // 公司数据
      departs: [], // 组织架构数据
      defaultProps: { // 树形组件排列
        label: 'name'
      },
      showDialog: false, // 弹出框是否显示
      // 点击节点信息
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 点击标签页
    handleClick(tab, event) {
      this.getDepartments()
    },
    // 获取组织数据
    async getDepartments() {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
    },
    // 点击操作添加 方法
    addDepts(node) {
      // 打开弹出框
      this.showDialog = true
      this.node = node
      console.log(node, '看看node')
    },
    // 点击编辑按钮
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 调用子组件获取 部门详情表单 方法
      this.$refs.addDepts.getDepartDetail(node.id)
    }
  }
}
</script>

    <style scoped>
  .card{
  padding: 30px 40px;
  font-size:14px;
  }
  .tabpane{
    padding: 30px 40px;
  }
    </style>

