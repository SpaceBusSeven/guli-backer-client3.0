import React,{Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'
import memoryUtil from '../../utils/memoryUtil'
import Logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu, Item } = Menu

class LeftNav extends Component{

  state = { OpenKeys: [] }

  hasAuth = (menu) => {
    const {key, isPublic} = menu
    const {username} = memoryUtil.user
    const {menus} = memoryUtil.user.role
    if (isPublic || username === 'admin' || menus.indexOf(key) !== -1) {
      return true
    } else if (menu.children) {
      return !!menu.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }

  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.reduce((pre, menu) => {
      if (this.hasAuth(menu)) {
        if (!menu.children) {
          pre.push(
            <Menu.Item key={menu.key}>
              <Link to={menu.key}>
                <Icon type={menu.icon}/>
                <span>{menu.title}</span>
              </Link>
            </Menu.Item>
          )
        } else {
          if (menu.children.find(child => path.indexOf(child.key) === 0)) {
            this.openKey = menu.key
          }
          pre.push(
            <SubMenu
              key={menu.key}
              title={
                <span>
                  <Icon type={menu.icon}/>
                  <span>{menu.title}</span>
                </span>
              }
            >
              { this.getMenuNodes(menu.children) }
            </SubMenu>
          )
        }
      }
      return pre
    }, [])
  }

  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    let path = this.props.location.pathname
    const {menuNodes, openKey} = this
    if (path.indexOf('/product') === 0) {
      path = '/product'
    }

    return (
      <div className='left-nav'>
        <Link to='/home' className='logo-link'>
          <img src={Logo} alt="logo"/>
          <h1>用户后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          { menuNodes }
        </Menu>
      </div>
    )
  }
}
export default withRouter(LeftNav)
