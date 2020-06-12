import React,{Component} from 'react'
import PropTypes from "prop-types";
import {Form, Input, Select} from "antd";

const {Option} = Select
const {Item} = Form

class UserForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array,
    user: PropTypes.object,
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {roles, user} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form labelCol={{span:5}} wrapperCol={{span:15}}>
        <Item label='用户名:'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
            })(<Input placeholder='input user name'/>)
          }
        </Item>
        {
          !user._id?(
            <Item label='密码:'>
              {
                getFieldDecorator('password', {
                  initialValue: user.password,
                })(<Input type='password' placeholder='input password'/>)
              }
            </Item>
          ):null
        }
        <Item label='邮箱:'>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
            })(<Input placeholder='input email'/>)
          }
        </Item>
        <Item label='电话:'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
            })(<Input placeholder='input phone'/>)
          }
        </Item>
        <Item label='角色:'>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
            })(
              <Select style={{width: 200}} placeholder=' 请选择角色'>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)
