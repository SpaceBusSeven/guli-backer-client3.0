import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import LinkButton from '../link-button'
import {reqWeather} from "../../api";
import {Modal} from "antd";
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import formatDate from '../../utils/formatDateUtil'
import menuList from '../../config/menuConfig'
import './index.less'

class Header extends Component{

  state = {
    sysTime: formatDate(Date.now()),
    weather: '',
    dayPictureUrl: '',
    title: ''
  }

  getSysTime = () => {
    this.timer = setInterval(() => {
      this.setState({ sysTime: formatDate(Date.now()) })
    }, 1000)
  }
  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('南京')
    this.setState({ dayPictureUrl, weather })
  }
  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(menu => {
      if (path.indexOf(menu.key) === 0) {
        title = menu.title
      } else if (menu.children) {
        const cItem = menu.children.find(cItem => path.indexOf(cItem.key)===0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }
  logout = () => {
    Modal.confirm({
      content: 'really logout ?',
      onOk: () => {
        storageUtil.removeUser()
        memoryUtil.user = {}
        clearInterval(this.timer)
        this.props.history.replace('/login')
      },
      onCancel: () => {
        console.log('logout cancel')
      }
    })
  }
  componentDidMount() {
    this.getWeather()
    this.getSysTime()
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const {username} = memoryUtil.user
    const {sysTime, weather, dayPictureUrl} = this.state
    const title = this.getTitle()

    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <span className='header-bottom-left'>{title}</span>
          <span className='header-bottom-right'>
            <span>{sysTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </span>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)
