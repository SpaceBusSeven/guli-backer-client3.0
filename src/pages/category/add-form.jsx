import React,{Component} from 'react'
import {Input, Select, Form} from "antd";
import PropTypes from 'prop-types'

const {Option} = Select
const {Item} = Form

class AddForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const { categorys, parentId } = this.props

    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option value='0' key='0'>一级分类</Option>
                {
                  categorys.map(cate => <Option value={cate._id} key={cate._id}>{cate.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(<Input placeholder='input category name'/>)
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
