<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="addRoler"
              >
                新增角色
              </el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)"> 分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end" align="middle" style="height:60px">
              <el-pagination
                background
                :current-page="page.page"
                :total="page.total"
                layout="total,prev, pager, next,sizes,jumper"
                :page-sizes="[2, 5, 7, 10]"
                :page-size="page.pagesize"
                @current-change="changePage"
                @size-change="changeSize"
              />
            </el-row>

          </el-tab-pane>
          <!-- 公司信息tab -->
          <el-tab-pane label="公司信息">
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 添加、编辑弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="showDialog"
      @close="btnPermCancel"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部按钮部分 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 添加权限弹框 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
    >
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
        show-checkbox
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <Footer />
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, addRole, getRoleDetail, updateRole, delRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 列表数据
      list: [],
      // 页数设置
      page: {
        page: 1,
        total: 0,
        pagesize: 10
      },
      // 公司信息
      formData: {
      },
      // 弹框标题
      title: '新增角色',
      // 弹框是否显示
      showDialog: false,
      showPermDialog: false,
      // 表单数据
      roleForm: {
        name: '',
        description: ''
      },
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      // 权限列表
      permData: [],
      // 权限树形图配置
      defaultProps: {
        label: 'name'
      },
      // 权限点标识
      selectCheck: [],
      // 存储分配权限的id
      roleId: null

    }
  },
  // 从vuex拿到公司id用来获取公司信息
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    // 点击页数
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 切换每页显示数量
    changeSize(size) {
      this.page.pagesize = size
      this.getRoleList()
    },
    // 点击新增角色
    addRoler() {
      this.title = '新增角色'
      this.showDialog = true
    },
    // 点击编辑按钮
    async editRole(id) {
      this.title = '编辑角色'
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 点击删除操作按钮
    async delRole(id) {
      try {
        await this.$confirm('确认删除角色吗？')
        await delRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 添加、编辑弹框的确定按钮
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 根据有无id判断是编辑还是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        // 重新拉取列表
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 点击权限
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(id), '0')
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.roleId = id
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    // 权限弹框按钮
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    },
    async btnPermOK() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    }

  }
}
</script>

      <style>

      </style>

