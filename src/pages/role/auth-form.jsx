import React,{Component} from 'react'
import {Tree, Input, Form} from 'antd';
import PropTypes from "prop-types";
import menuList from '../../config/menuConfig'

const { TreeNode } = Tree;
const {Item} = Form

export default class AuthForm extends Component{

  static propTypes = {
    role: PropTypes.object,
  }
  constructor(props) {
    super(props)
    const {menus} = this.props.role
    this.state = { checkedKeys: menus }
  }
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, menu) => {
      pre.push(
        <TreeNode key={menu.key} title={menu.title}>
          {menu.children?this.getTreeNodes(menu.children):null}
        </TreeNode>
      )
      return pre
    }, [])
  }
  //选中某个 node 时的回调
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys })
  }

  getMenus = () => this.state.checkedKeys
  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const menus = nextProps.role.menus
    this.setState({ checkedKeys: menus })
  }

  render() {
    const {role} = this.props
    const {checkedKeys} = this.state
    const {treeNodes} = this

    return (
      <div>
        <Form>
          <Item label='角色名称:' labelCol={{span:5}} wrapperCol={{span:15}}>
            <Input value={role.name} disabled/>
          </Item>
        </Form>
        <Tree
          checkable
          onCheck={this.onCheck}
          checkedKeys={checkedKeys}
          defaultExpandAll={true}
        >
          <TreeNode title='平台权限' key='all'>
            {treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}
