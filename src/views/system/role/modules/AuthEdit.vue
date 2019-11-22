<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-tree
        ref="tree"
        checkable
        :expandedKeys="expandedKeys"
        :checkedKeys="checkedKeys"
        :autoExpandParent="autoExpandParent"
        :treeData="treeData"
        :replaceFields="replaceFields"
        @expand="onExpand"
        @select="this.onSelect"
        @check="this.onCheck"
      />
    </a-spin>

  </a-modal>
</template>

<script>
import { getSysMenuSelectList, getSysMenuOriginalList, saveSysRoleMenu, findSysRoleMenu } from '@/api/manage'

let roleItem = []

export default {
  data () {
    return {
      id: '',
      visible: false,
      confirmLoading: true,
      form: this.$form.createForm(this),
      title: '配置权限',
      replaceFields: { key: 'id', title: 'name', children: 'children' },
      expandedKeys: [],
      autoExpandParent: true,
      checkStrictly: false,
      checkedKeys: [],
      selectedKeys: [],
      submitKeys: [],
      defaultCheckedKeys: [],
      treeData: [],
      menuList: [],
      editType: false
    }
  },
  methods: {
    // 初始化数据
    initData () {
      this.confirmLoading = true
      getSysMenuSelectList({}).then((res) => {
        // this.treeData = this.formatTreeData(0, res.data)
        this.treeData = res.data
        this.initRoleData()
      })
    },
    initRoleData () {
      Promise.all([findSysRoleMenu({ id: this.id }), getSysMenuOriginalList()]).then(datas => {
        this.menuList = datas[1].data

        this.formatRoleTreeData(datas[0].data)

        this.expandedKeys = roleItem
        this.checkedKeys = roleItem
        this.submitKeys = roleItem
        this.confirmLoading = false
      })
    },

    formatRoleTreeData (data) {
      data.map((list, i) => {
        const parentItem = this.menuList.find((item) => {
          return item.parent_id === list.menu_id
        })
        // tree 回显bug
        if (!parentItem) {
          roleItem.push(list.menu_id)
        }
      })
      this.confirmLoading = false
    },

    edit (e) {
      this.title = '配置权限'
      this.visible = true
      this.id = e.id
      this.initData()
    },
    handleSubmit () {
      if (this.editType) {
        saveSysRoleMenu({
          role_id: this.id,
          menuIds: this.submitKeys ? this.submitKeys : []
        }).then((res) => {
          this.visible = false
          this.expandedKeys = []
          this.autoExpandParent = true
          this.checkStrictly = true
          this.checkedKeys = []
          this.submitKeys = []
          this.selectedKeys = []
          this.treeData = []
          roleItem = []
          this.$emit('refresh')
          this.$message.success('保存成功')
        }).catch(() => {})
      } else {
        this.visible = false
        this.$message.success('保存成功')
      }
    },
    handleCancel () {
      this.visible = false
      this.expandedKeys = []
      this.autoExpandParent = true
      this.checkStrictly = false
      this.checkedKeys = []
      this.submitKeys = []
      this.selectedKeys = []
      this.treeData = []
      roleItem = []
    },
    // 设置form中的数据
    setFormDataHandler (k, val) {
      this.form.setFieldsValue({
        [k]: val
      })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys, info) {
      this.editType = true
      this.checkedKeys = checkedKeys
      this.submitKeys = [...checkedKeys, ...info.halfCheckedKeys]
    },
    onSelect (selectedKeys, info) {
      // this.selectedKeys = selectedKeys
    }
  }
}
</script>
