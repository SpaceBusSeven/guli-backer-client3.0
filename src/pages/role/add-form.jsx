import React,{Component} from 'react'
import PropTypes from "prop-types";
import {Form, Input} from "antd";

const {Item} = Form

class AddForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form>
        <Item label='角色名称:' labelCol={{span:5}} wrapperCol={{span:15}}>
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules:[{required:true, message:'role name neccessary'}]
            })(<Input placeholder='input role name'/>)
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
