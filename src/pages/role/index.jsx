import React,{Component} from 'react'
import {Button, Card, message, Table, Modal} from "antd";
import {PAGE_SIZE} from "../../config/constants";
import {reqRoleUpdate, reqRoleAdd, reqRoles} from "../../api";
import formatDate from '../../utils/formatDateUtil'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtil from "../../utils/memoryUtil";

export default class Role extends Component{

  state = {
    loading:false,
    roles:[],
    role:{},
    addModal:false,
    authModal:false
  }
  constructor(props) {
    super(props)
    this.auth = React.createRef()
  }
  initColumns = () => {
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name'
      },{
        title:'创建时间',
        dataIndex:'create_time',
        render: formatDate
      },{
        title:'授权时间',
        dataIndex:'auth_time',
        render: formatDate
      },{
        title:'授权人',
        dataIndex:'auth_name',
      }
    ]
  }
  getRoles = async () => {
    this.setState({ loading:true })
    const result = await reqRoles()
    this.setState({ loading:false })
    if (result.status === 0) {
      this.setState({ roles: result.data })
    } else {
      message.error('get roles failed')
    }
  }
  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({ role })
      }, // 点击行
    }
  }
  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if (!error) {
        const {roleName} = values
        this.cancelAddModal()
        const result = await reqRoleAdd(roleName)
        if (result.status === 0) {
          message.success('add role success')
        } else {
          message.error('add role failed')
        }
      }
    })
  }
  cancelAddModal = () => {
    this.setState({ addModal: false })
    this.form.resetFields()
  }
  setRoleAuth = async () => {
    const role = this.state.role

    role.menus = this.auth.current.getMenus()
    role.create_time = Date.now()
    role.auth_name = memoryUtil.user.username

    const result = await reqRoleUpdate(role)
    if (result.status === 0) {
      message.success('set auth success')
    } else {
      message.error('set auth failed')
    }
    this.setState({ authModal: false })
  }

  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {role, roles, loading, addModal, authModal} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({ addModal: true })}>创建角色</Button>
        &nbsp;&nbsp;
        <Button
          type='primary'
          disabled={role._id?false:true}
          onClick={() => this.setState({ authModal: true })}
        >设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          columns={this.columns}
          dataSource={roles}
          rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect: role => this.setState({ role })
          }}
          onRow={this.onRow}
          pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper:true}}
        ></Table>
        <Modal
          title='添加角色'
          visible={addModal}
          onOk={this.addRole}
          onCancel={this.cancelAddModal}
        >
          <AddForm setForm={form => this.form = form}></AddForm>
        </Modal>
        <Modal
          title='设置角色权限'
          visible={authModal}
          onOk={this.setRoleAuth}
          onCancel={() => this.setState({ authModal: false })}
        >
          <AuthForm ref={this.auth} role={role}></AuthForm>
        </Modal>
      </Card>
    )
  }
}
