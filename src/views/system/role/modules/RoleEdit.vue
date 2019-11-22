<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="horizontal">

        <a-form-item label="角色名" v-bind="formItemLayout">
          <a-input
            :maxLength="16"
            v-decorator="['role_name', { rules: [{ required: true, message: '请输入角色名' }] }]"
            allowClear
          />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveSysRole, updateSysRole, getSysRoleByID } from '@/api/manage'

export default {
  data () {
    return {
      id: '',
      isView: true,
      title: '查看',
      visible: false,
      confirmLoading: true,
      initInfo: null,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      }
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      if (this.isView) {
        this.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.id) {
            saveSysRole(values)
              .then(res => {
                this.handleCancel()
                this.$message.success('保存成功')
                this.$emit('refresh')
              })
              .catch(() => {
                this.confirmLoading = false
              })
          } else {
            values.id = this.id
            updateSysRole(values)
              .then(res => {
                this.handleCancel()
                this.$message.success('保存成功')
                this.$emit('refresh')
              })
              .catch(() => {
                this.confirmLoading = false
              })
          }
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
      this.id = ''
      this.form.resetFields()
    },

    initEditInfo () {
      const _this = this
      return new Promise(resolve => {
        if (!_this.id) {
          _this.initInfo = null
          resolve()
          return
        }
        getSysRoleByID({ id: _this.id }).then(res => {
          _this.initInfo = res.data
          resolve()
        })
      })
    },
    initData (isEdit, _id = '') {
      this.id = _id
      this.isView = true
      if (isEdit) {
        this.title = '编辑'
        this.isView = false
      }
      Promise.all([this.initEditInfo()]).then(datas => {
        this.visible = true
        this.confirmLoading = false
        this.$nextTick(() => {
          this.setFormDataHandler(this.initInfo)
        })
      })
    },
    // 设置form中的数据
    setFormDataHandler (k, val) {
      if (k instanceof Object) {
        for (const key in k) {
          if (this.form.domFields[key]) {
            this.form.setFieldsValue({
              [key]: k[key]
            })
          }
        }
        return
      }
      if (this.form.domFields[k]) {
        this.form.setFieldsValue({
          [k]: val
        })
      }
    }
  }
}
</script>
