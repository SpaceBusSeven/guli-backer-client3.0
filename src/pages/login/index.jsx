import React,{Component} from 'react'
import {Redirect} from "react-router-dom";
import {Form, Button, Input, Icon, message} from "antd";
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import {reqLogin} from "../../api";
import Logo from '../../assets/images/logo.png'
import './index.less'

const {Item} = Form

class Login extends Component{

  //自定义验证密码
  validatePwd = (rule, value, callback) => {
    if (value.length < 4) {
      callback('length > 4')
    } else if (value.length > 12) {
      callback('length < 12')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('a-z A-Z 0-9 _')
    } else {
      callback()
    }
  }

  login = (event) => {
    // 阻止事件的默认行为
    event.preventDefault()
    //验证字段
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const {username, password} = values
        const result = await reqLogin(username, password)
        if (result.status === 0) {
          const user = result.data
          storageUtil.saveUser(user)
          memoryUtil.user = user
          this.props.history.replace('/')
        } else {
          message.error('login failed, error：'+result.msg)
        }
      }
    })
  }

  render() {
    if (memoryUtil.user && memoryUtil.user._id) {
      return <Redirect to='/'></Redirect>
    }
    const {getFieldDecorator} = this.props.form

    return (
      <div className='login'>
        <div className='login-header'>
          <img src={Logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </div>
        <div className='login-content'>
          <h3>用户登录</h3>
          <Form className='login-form' onSubmit={this.login}>
            <Item>
              {
                getFieldDecorator('username', {
                  initialValue:'admin',
                  rules: [
                    {required:true, message:'must username'},
                    {min:4, message:'length > 4 '},
                    {max:12, message:'length < 12 '},
                    {pattern:/^[a-zA-Z0-9_]+$/, message:'must a-z A-Z 0-9 _'},
                  ]
                })(
                  <Input placeholder='input username' prefix={<Icon type='user'/>}/>
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator('password', {
                  rules:[{ validator: this.validatePwd }]
                })(
                  <Input type='password' placeholder='input password' prefix={<Icon type='lock'/>}/>
                )
              }
            </Item>
            <Button type='primary' className='login-form-button' htmlType="submit">登录</Button>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(Login)
