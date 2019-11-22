<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="角色名">
              <a-input v-model="queryParam.role_name" placeholder="请输入角色名" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.state" placeholder="请选择状态">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="$refs.table.refresh(true)" type="primary">查询</a-button>
              <a-button @click="queryParam = {};$refs.table.refresh(true)" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24" class="fr">
            <a-row type="flex" justify="end">
              <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">

      <s-table ref="table" size="default" :rowKey="record => record.id" :columns="columns" :data="loadData">
        <span slot="state" v-if="row.id !== 1" slot-scope="text, row">
          <a-switch :checked="text === 1" @change="handleChangeState(text, row)" />
        </span>
        <span slot="action" v-if="record.id !== 1" slot-scope="text, record">
          <a @click="handleAuth(record)">配置权限</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
        </span>
      </s-table>
    </a-spin>

    <role-edit @refresh="$refs.table.refresh(true)" ref="roleEditRef"></role-edit>
    <auth-edit ref="authEditRef"></auth-edit>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getSysRoleList, updateRoleState, deleteSysRole } from '@/api/manage'
import RoleEdit from './modules/RoleEdit'
import AuthEdit from './modules/AuthEdit'

export default {
  name: 'TableList',
  components: {
    STable,
    RoleEdit,
    AuthEdit
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      confirmLoading: false,
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          sorter: true
        },
        {
          title: '角色名称',
          dataIndex: 'role_name'
        },
        {
          title: '状态',
          dataIndex: 'state',
          sorter: true,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          sorter: true
        },
        {
          title: '操作',
          width: '200px',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },

  methods: {
    loadData (parameter) {
      return new Promise(resolve => {
        getSysRoleList(Object.assign(parameter, this.queryParam)).then(res => {
          resolve(res.data)
        })
      })
    },
    handleEdit (record) {
      this.$refs.roleEditRef.initData(true, record.id)
    },
    handleAdd () {
      this.$refs.roleEditRef.initData(true)
    },
    handleAuth (record) {
      this.$refs.authEditRef.edit(record)
    },
    handleDel (record) {
      const _this = this
      this.$confirm({
        title: '提示',
        content: '删除角色，是否确定？',
        okType: 'danger',
        onOk () {
          return new Promise(resolve => {
            deleteSysRole({ id: record.id })
              .then(res => {
                _this.$refs.table.refresh(true)
                _this.$message.success('操作成功')
                resolve()
              })
              .catch(() => {
                resolve()
              })
          })
        },
        onCancel () {
          _this.$message.error('已取消')
        }
      })
    },
    handleChangeState (_value, _row) {
      this.confirmLoading = true
      updateRoleState({
        id: _row.id,
        state: _value === 0 ? 1 : 0
      }).then(() => {
        this.$refs.table.refresh()
        this.$message.success('修改成功')
        this.confirmLoading = false
      }).catch(() => {
        this.confirmLoading = false
      })
    }
  }
}
</script>
