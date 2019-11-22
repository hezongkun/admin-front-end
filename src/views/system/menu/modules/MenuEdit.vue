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
        <a-form-item label="父级菜单" v-bind="formItemLayout">
          <a-select
            v-decorator="['parent_id', { rules: [{ required: true, message: '请选择父级菜单' }] }]"
            placeholder="请选择父级菜单"
          >
            <a-select-option v-for="item in menuList" :key="item.id" :value="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="菜单名" v-bind="formItemLayout">
          <a-input
            :maxLength="16"
            v-decorator="['name', { rules: [{ required: true, message: '请输入菜单名' }] }]"
            allowClear
          />
        </a-form-item>
        <a-form-item label="权限标识" v-bind="formItemLayout">
          <a-input
            :maxLength="100"
            v-decorator="['permisson', { rules: [{ required: true, message: '请输入权限标识' }] }]"
            allowClear
          />
        </a-form-item>
        <!-- <a-form-item label="类型" v-bind="formItemLayout">
          <a-radio-group buttonStyle="solid" v-decorator="['type',{initialValue:'0'}]" @change="typeChange">
            <a-radio-button value="0">按钮</a-radio-button>
            <a-radio-button value="1">菜单</a-radio-button>
          </a-radio-group>
        </a-form-item> -->
        <a-form-item label="是否是菜单" v-bind="formItemLayout">
          <a-switch v-decorator="['type', { valuePropName: 'checked' ,initialValue:false}]" @change="typeChange"/>
        </a-form-item>
        <div v-if="isMenu">
          <a-form-item label="path" v-bind="formItemLayout">
            <a-input
              :maxLength="100"
              v-decorator="['path', { rules: [{ message: '请输入路径' }] }]"
              allowClear
            />
          </a-form-item>
        </div>
        <a-form-item label="是否显示" v-bind="formItemLayout">
          <a-switch v-decorator="['hidden', { valuePropName: 'checked' ,initialValue:false}]"/>
        </a-form-item>
        <a-form-item label="排序" v-bind="formItemLayout">
          <a-input
            :maxLength="10"
            v-decorator="['sort']"
            allowClear
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getSysMenuOriginalList, saveSysMenu, updateSysMenu, getSysMenuByID } from '@/api/manage'

export default {
  data () {
    return {
      id: '',
      isView: true,
      title: '查看',
      visible: false,
      confirmLoading: true,
      menuList: [],
      initInfo: null,
      isMenu: false,
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
          values.hidden = values.hidden ? 1 : 0
          values.type = values.type ? 1 : 0

          if (!this.id) {
            saveSysMenu(values)
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
            updateSysMenu(values)
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
      this.isMenu = false
      this.initInfo = null
      this.form.resetFields()
    },
    initMenuList () {
      return new Promise(resolve => {
        getSysMenuOriginalList({ type: 1 }).then(res => {
          this.menuList = res.data
          resolve()
        })
      })
    },
    initEditInfo () {
      const _this = this
      return new Promise(resolve => {
        if (!_this.id) {
          resolve()
          return
        }
        getSysMenuByID({ id: _this.id }).then(res => {
          _this.initInfo = res.data
          _this.initInfo.hidden = !!_this.initInfo.hidden
          _this.initInfo.type = !!_this.initInfo.type
          _this.isMenu = !!_this.initInfo.type
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
      Promise.all([this.initMenuList(), this.initEditInfo()]).then(datas => {
        this.visible = true
        this.confirmLoading = false
        this.$nextTick(() => {
          this.setFormDataHandler(this.initInfo)
        })
      })
    },
    initDataByParentID (parentID) {
      this.initInfo = {
        parent_id: parentID
      }
      this.initData(true, '')
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
    },
    typeChange (e) {
      this.$nextTick(() => {
        this.isMenu = this.form.getFieldValue('type')
      })
    }
  }
}
</script>
