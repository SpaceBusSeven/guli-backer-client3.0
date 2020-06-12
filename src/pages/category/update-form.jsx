import React,{Component} from 'react'
import PropTypes from "prop-types";
import {Form, Input} from "antd";

const {Item} = Form

class UpdateForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const { category } = this.props

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: category.name
            })(<Input placeholder='input category name'/>)
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UpdateForm)
