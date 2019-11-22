<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="菜单名">
              <a-input v-model="queryParam.name" placeholder="请输入菜单名/链接" />
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
              <a-button type="primary" icon="plus" v-action="'sys.menu.add'" @click="handleAdd()">新建</a-button>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">

      <s-table ref="table" size="default" :rowKey="record => record.id" :columns="columns" :data="loadData">
        <span slot="name" slot-scope="text,record">
          <span :class="record.type===1 ? '':'cyan'">{{ text }}</span>
        </span>
        <span slot="state" slot-scope="text, record">
          <a-switch :disabled="record.name === '主菜单'" :checked="text === 1" @change="handleChangeState(text, record)" />
        </span>
        <span slot="hidden" slot-scope="text">
          <span>{{ text === 1 ? '显示' : '隐藏' }}</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <div v-if="record.name !== '主菜单'">
            <a v-if="record.type === 1" @click="handleAddChild(record)" v-action="'sys.menu.add'" >添加子菜单</a>
            <a-divider v-action="'sys.menu.update'" v-if="record.type === 1" type="vertical" />
            <a @click="handleEdit(record)" v-action="'sys.menu.update'" >编辑</a>
            <a-divider v-action="'sys.menu.delete'" type="vertical" />
            <a @click="handleDel(record)" v-action="'sys.menu.delete'" >删除</a>
          </div>
        </span>
      </s-table>
    </a-spin>

    <menu-edit @refresh="$refs.table.refresh(true)" ref="menuEditRef"></menu-edit>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getSysMenuList, updateMenuState, deleteSysMenu } from '@/api/manage'
import MenuEdit from './modules/MenuEdit'

export default {
  name: 'TableList',
  components: {
    STable,
    MenuEdit
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
          title: '菜单名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '路径',
          dataIndex: 'path'
        },
        {
          title: '权限标识',
          dataIndex: 'permisson'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '是否显示',
          dataIndex: 'hidden',
          scopedSlots: { customRender: 'hidden' }
        },
        {
          title: '操作',
          width: '300px',
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
        getSysMenuList(Object.assign(parameter, this.queryParam)).then(res => {
          resolve(res.data)
        })
      })
    },
    handleEdit (record) {
      this.$refs.menuEditRef.initData(true, record.id)
    },
    handleAdd () {
      this.$refs.menuEditRef.initData(true)
    },
    handleAddChild (record) {
      this.$refs.menuEditRef.initDataByParentID(record.id)
    },
    handleDel (record) {
      const _this = this
      this.$confirm({
        title: '提示',
        content: '删除菜单，是否确定？',
        okType: 'danger',
        onOk () {
          return new Promise(resolve => {
            deleteSysMenu({ id: record.id })
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
      updateMenuState({
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
<style lang="less">
  .cyan{
    color: #13c2c2;
    background: #e6fffb;
    border-color: #87e8de;
    padding: 5px;
    font-size: 10px;
    border-radius: 3px;
  }
</style>
