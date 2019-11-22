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
        <a-form-item label="角色" v-bind="formItemLayout">
          <a-select
            v-decorator="['role_id', { rules: [{ required: true, message: '请选择角色' }] }]"
            placeholder="请选择角色"
          >
            <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">{{
              item.role_name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="用户名" v-bind="formItemLayout">
          <a-input
            :maxLength="16"
            v-decorator="['username', { rules: [{ required: true, message: '请输入用户名' }] }]"
            allowClear
          />
        </a-form-item>
        <a-form-item label="姓名/昵称" v-bind="formItemLayout">
          <a-input
            :maxLength="16"
            v-decorator="['nickname', { rules: [{ required: true, message: '请输入姓名/昵称' }] }]"
            allowClear
          />
        </a-form-item>
        <a-form-item label="手机号" v-bind="formItemLayout">
          <a-input
            :maxLength="11"
            v-decorator="['phone', { rules: [{ required: true, message: '请输入手机号' }] }]"
            allowClear
          />
        </a-form-item>
        <a-form-item label="密码" v-bind="formItemLayout">
          <a-input
            type="password"
            :maxLength="16"
            v-decorator="['password', { rules: [{ required: !id, message: '请输入密码' }] }]"
            allowClear
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getSysRoleSelectList, saveSysUser, updateSysUser, getSysUserByID } from '@/api/manage'

export default {
  data () {
    return {
      id: '',
      isView: true,
      title: '查看',
      visible: false,
      confirmLoading: true,
      roleList: [],
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
            saveSysUser(values)
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
            updateSysUser(values)
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
    initRoleList () {
      return new Promise(resolve => {
        getSysRoleSelectList().then(res => {
          this.roleList = res.data
          resolve()
        })
      })
    },
    initEditInfo () {
      const _this = this
      return new Promise(resolve => {
        if (!_this.id) {
          _this.initInfo = null
          resolve()
          return
        }
        getSysUserByID({ id: _this.id }).then(res => {
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
      Promise.all([this.initRoleList(), this.initEditInfo()]).then(datas => {
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
