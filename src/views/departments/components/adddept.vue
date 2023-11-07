<template>
  <el-dialog title="showTitle" :visible="showDialog" width="40%" @close="btnCancel">
    <!-- 表单部分 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in people" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 按钮部分 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="16">
        <el-button @click="btnCancel">取消</el-button>
        <el-button type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, getDepartDetail, updateDepartments, addDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到同级部门的所有的子部门
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑的数据 在数据库里有!!!  同级部门下 我的名字不能和其他的同级部门的名字进行重复
        // 首先要找到我的同级部门   this.formData.id 就是我当前的id 我的pid是 this.formData.pid
        // depts.filter(item => item.pid === this.formData.pid)
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true  表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
      //  编辑模式下
        // 要求是 不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式下
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 要求编码 和所有的部门编码都不能重复 由于历史数据有可能 没有code 所以说这里加一个强制性条件 就是 value值不为空
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: { // 校验规则 {key: 数组}
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkNameRepeat
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      },
      people: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  },
  methods: {
    // 根据id获取部门详情表单
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple()
    },
    // 点击取消按钮
    btnCancel() {
      // 重置表单
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      // 清除之前的校验  可以重置数据 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    },
    btnOK() {
      // 手动校验
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          // 判断是否为编辑
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 调用父组件更新数据
          this.$emit('upDepts')
          // 关闭弹窗
          this.$emit('update:showDialog', false)
        }
      })
    }
  }
}
</script>

<style>

</style>
