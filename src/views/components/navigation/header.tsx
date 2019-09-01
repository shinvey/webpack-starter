import * as React from 'react'

import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { List, NavBar, Picker } from 'antd-mobile'

import { NavBarProps } from 'antd-mobile/lib/nav-bar/PropsType'

import CommonStyle from '../common.scss'

import hdStyle from './header.scss'
import { isJudge } from '../helpers'

export interface HeaderNavBarProps extends NavBarProps {
  // history: any
  // title: string | React.ReactNode
  isBack?: any | true // 是否显示返回按钮，默认存在返回
  goBack?: any
  [random: string]: any
}

interface HeaderState {
  // history: any
  [random: string]: any
}

@connect(state => ({
  theme: state.switchTheme.theme
}))
class Header extends React.PureComponent<
  HeaderNavBarProps,
  HeaderState
> {
  public static defaultProps = {
    mode: 'dark'
  }

  public district = [
    {
      label: '存款',
      value: '1'
    },
    {
      label: '提现',
      value: '2'
    },
    {
      label: '转账',
      value: '3'
    },
    {
      label: '红利',
      value: '4'
    }
  ]

  constructor(props) {
    super(props)
  }

  public goBack = () => {
    // if (this.props.goSetting) {
    //   this.props.goSetting();
    //   return;
    // }
    if (this.props.isMine) {
      this.props.history.push('/app/mine')
      return false
    }
    if (this.props.goBack) {
      this.props.goBack()
      return
    }
    this.props.history.go(-1)
  }

  public rightContents = id => {
    if (this.props.onRightClick) {
      return (
        <span
          key={'0'}
          className={CommonStyle.delets}
          onClick={this.props.onRightClick}
        />
      )
    } else if (this.props.refreshClick) {
      return (
        <i
          onClick={this.props.refreshClick}
          className={CommonStyle.refreshAll}
        />
      )
    } else if (this.props.tutorialClick) {
      return (
        <div
          style={{
            height: '100%',
            width: '50%',
            display: 'flex',
            position: 'relative'
          }}
        >
          <span
            className={CommonStyle.tutorialIcon}
            onClick={() => {
              this.props.tutorialClick()
            }}
          />
        </div>
      )
    } else if (this.props.transferClick) {
      return (
        <div>
          <span
            className={hdStyle.searchBtn}
            onClick={this.props.searchClick}
          />
          <span
            className={hdStyle.transferBtn}
            onClick={this.props.transferClick}
          />
        </div>
      )
    } else if (this.props.isDetails) {
      return (
        <span
          // className={hdStyle.recordDown}
          onClick={this.props.goDetails}
        >
          明细
        </span>
      )
    } else if (this.props.transRecord) {
      return (
        <span className={'headrightStyle'}>
          {/* <span className={hdStyle.selectJiaoyi} /> */}
          <Picker
            onChange={this.props.recordIconClick}
            onOk={val => {
              this.recordCheck(val)
            }}
            value={this.props.valueCurunt}
            className={isJudge(id === 'space')(
              'spaceList',
              'defualtList'
            )}
            cols={1}
            // itemStyle={{ background: 'red' }}
            // indicatorStyle={{ background: 'green' }}
            data={this.district}
          >
            <List.Item extra={''}> </List.Item>
          </Picker>
        </span>
      )
    } else if (this.props.betRecord) {
      return (
        <span className={'headrightStyle'}>
          {/* <span className={hdStyle.selectJiaoyi} /> */}
          <Picker
            onChange={this.props.betRecordIconClick}
            onOk={val => {
              this.recordCheck(val)
            }}
            value={this.props.valueCurunt}
            className={isJudge(id === 'space')(
              'spaceList',
              'defualtList'
            )}
            cols={1}
            // cascade={false}
            extra={'全部'}
            // itemStyle={{ background: 'red' }}
            // indicatorStyle={{ background: 'green' }}
            data={this.props.objBet}
          >
            <List.Item extra={''}> </List.Item>
          </Picker>
        </span>
      )
    } else if (this.props.helpClick) {
      return (
        <span
          className={CommonStyle.depositHelp}
          onClick={() => {
            this.props.helpClick()
          }}
        >
          帮助
        </span>
      )
    }
  }
  public recordCheck = val => {
    console.log(val)
  }
  public render() {
    const { title, history, isBack } = this.props
    const { backgroundHead, id } = this.props.theme
    return (
      <div
        id={'header'}
        style={{
          position: 'absolute',
          top: '0px',
          height: '0.88rem',
          width: '100%',
          zIndex: 999
        }}
      >
        <NavBar
          title={title}
          // history={history}
          style={{
            background: backgroundHead,
            color: '#fff',
            height: '0.88rem'
          }}
          icon={
            !isBack ? (
              <div style={{ height: '0.44rem' }} onClick={this.goBack}>
                <i className={hdStyle.iconback} />
                <span
                  style={{
                    float: 'left',
                    lineHeight: '0.44rem',
                    fontSize: '0.30rem'
                  }}
                >
                  返回
                </span>
              </div>
            ) : (
              <div />
            )
          }
          rightContent={this.rightContents(id)}
        >
          <span className={hdStyle['hd-tittle']}>{this.props.title}</span>
        </NavBar>
      </div>
    )
  }
}
export default withRouter(Header)
