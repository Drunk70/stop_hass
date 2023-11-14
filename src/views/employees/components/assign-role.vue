<template>
  <el-dialog
    title="角色分配"
    :visible="showRoleDialog"
    @close="btnCancel"
  >
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async  getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    // 根据用户id获取所拥有的角色
    async getUserDetail(id) {
      const { roleIds } = await getUserDetail(id)
      this.roleIds = roleIds
    },
    // 点击确定给用户分配角色
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = [] // 重置数组 将它还原成一个空
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
