import React,{Component} from 'react'
import {Button, Card, Modal, Table, message} from "antd";
import {PAGE_SIZE} from "../../config/constants";
import formatDate from "../../utils/formatDateUtil";
import {reqUserAddUpdate, reqUserDel, reqUsers} from "../../api";
import LinkButton from "../../components/link-button";
import UserForm from './user-form'

export default class User extends Component{

  state = {
    loading:false,
    showModal:false,
    users:[]
  }
  initColumns = () => {
    this.columns = [
      {
        title:'用户名',
        dataIndex:'username'
      },{
        title:'邮箱',
        dataIndex:'email',
      },{
        title:'电话',
        dataIndex:'phone',
      },{
        title:'注册时间',
        dataIndex:'create_time',
        render: formatDate
      }, {
        title:'所属角色',
        dataIndex:'role_id',
        render:role_id => this.roleNames[role_id]
      },{
        title:'操作',
        render: user => (
          <span>
            <LinkButton onClick={() => this.updateUser(user)}>修改</LinkButton>&nbsp;&nbsp;
            <LinkButton onClick={() => this.delUser(user)}>删除</LinkButton>
          </span>
        )
      }
    ]
  }
  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
  }
  getUsers = async () => {
    this.setState({ loading:true })
    const result = await reqUsers()
    this.setState({ loading:false })
    if (result.status === 0) {
      const {roles, users} = result.data
      this.initRoleNames(roles)
      this.setState({ roles, users })
    } else {
      message.error('get users failed')
    }
  }
  delUser = (user) => {
    Modal.confirm({
      content:'del '+user.username+' ?',
      onOk:async () => {
        const result = await reqUserDel(user._id)
        if (result.status === 0) {
          message.success('del user success')
        } else {
          message.error('del user failed')
        }
      },
      onCancel: () => {
        console.log('cancel del user :'+user.username)
      }
    })
  }
  updateUser = (user) => {
    this.setState({ showModal: true })
    this.user = user
  }
  addUser = () => {
    this.setState({ showModal: true })
    this.user = null
  }
  cancelModal = () => {
    this.form.resetFields()
    this.setState({ showModal: false })
  }
  userOperate = () => {
    this.form.validateFields(async (error, values) => {
      if(!error) {
        const user = values
        this.cancelModal()
        if (this.user) {
          user._id = this.user._id
        }
        const result = await reqUserAddUpdate(user)
        if (result.status === 0) {
          message.success('save user success')
          this.getUsers()
        } else {
          message.error('save user failed')
        }
      }
    })
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }

  render() {
    const {showModal, loading, roles, users} = this.state
    const title = <Button type='primary' onClick={this.addUser}>创建用户</Button>
    const user = this.user || {}
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          columns={this.columns}
          dataSource={users}
          pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper:true}}
        ></Table>
        <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={showModal}
          onOk={this.userOperate}
          onCancel={this.cancelModal}
        >
          <UserForm setForm={form => this.form = form} user={user} roles={roles}></UserForm>
        </Modal>
      </Card>
    )
  }
}
