<template>
  <div>
    <el-card class="page-tools">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col>
          <!-- 前置插槽 -->
          <div v-if="showBefore" class="before">
            <i class="el-icon-info" />
            <slot name="before" />
          </div>
        </el-col>
        <el-col>
          <!-- 后置插槽 -->
          <el-row type="flex" justify="end">
            <!-- 后插槽 -->
            <slot name="after" />
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang='scss'>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }

</style>
