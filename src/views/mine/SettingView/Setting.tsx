import * as React from 'react'
import { connect } from 'react-redux'
import {
  ContainerPropsInterface,
  ContainerStateInterface
} from '../../components/containerInterface'
import * as _ from 'lodash'
import { setDataStatistics, isJudge } from '@/views/components/helpers'
import Header from '../../components/navigation/header'
import SetingStyle from './setStyle.scss'
import SwitchButton from '../../components/SwitchTheme'
import { Scrollbars } from 'react-custom-scrollbars'
import { withRouter } from 'react-router'
import {
  asyncSetTheme,
} from '@/views/components/SwitchTheme/redux/actions'

@connect(state => ({
  theme: state.switchTheme.theme
}))
class Setting extends React.PureComponent<
  ContainerPropsInterface<any>,
  ContainerStateInterface
> {

  public setList = [
    {
      title: '修改个人资料',
      pathname: '/app/mine/personInfor'
    },
    {
      title: '手机号码',
      pathname: '/app/mine/phone'
    },
    {
      title: '银行卡管理',
      pathname: '/app/mine/bankCard'
    },
    {
      title: '邮箱地址',
      pathname: '/app/mine/email'
    },
    {
      title: '修改密码',
      pathname: '/app/mine/password'
    }
  ]
  constructor(props) {
    super(props)
    this.state = {
      //
    }
  }

  public componentDidMount() {
    // 数据统计
    setDataStatistics(
      '/app/mine/setting',
      '个人设置',
      '进入个人设置页面'
    )
  }

  public render() {
    const userInfo  = this.props.userInfo || {}
    const setList = [
      // {
      //   title: '修改个人资料',
      //   pathname: '/app/mine/personInfor',
      //   info: userInfo.name,
      //   log: '用于提现时的安全核对'
      // },
      [
        {
          title: '手机号码',
          pathname: '/app/mine/phone',
          info: userInfo.phone,
          log: '用于找回密码'
        },

        {
          title: '邮箱地址',
          pathname: '/app/mine/email',
          info: userInfo.email,
          log: ''
        },
        {
          title: '修改密码',
          pathname: '/app/mine/password',
          log: '用于账号登录'
        }
      ],

      [
        {
          img: '/assets/mine/icon_night_sidebar.png',
          // imgSpace: '/assets/mine/space/icon_night_sidebar.png',
          title: '夜间模式',
          pathname: '',
          log: ''
        }
      ],
      [
        {
          // img: '/assets/mine/icon_onus.png',
          // imgSpace: '/assets/mine/space/icon_onus.png',
          title: '关于我们',
          pathname: '/mine/about-us',
          info: 'about',
          log: ''
        }
      ]
    ]
    const {
      background,
      color,
      boxShadow,
      infoColor,
      disableTextColor
    } = this.props.theme.mine
    const styles = this.props.theme
    // const { token } = this.props.all.app.userInfo
    const { history } = this.props
    // const { background, color, liBg } = this.props.all.theme.mine.setting;
    return (
      <div
        className={SetingStyle.setBox}
        style={{ background: styles.background }}
      >
        <Header
          history={history}
          title={'个人设置'}
          goBack={() => this.props.history.push('/app/mine')}
        />
        <Scrollbars autoHeight autoHeightMin={document.body.clientHeight}>
          <div className={SetingStyle.setMain}>
            {_.map(setList, (ite: any, index1) => {
              return (
                <ul key={index1} style={{ background, color, boxShadow }}>
                  {_.map(ite, (item, index) => {
                    return (
                      <li
                        key={index}
                        style={{ background, color }}
                        onClick={() => {
                          // this.props.history.push(item.pathname)
                        }}
                      >
                        {item.title}

                        {isJudge(item.title === '夜间模式')(
                          <div
                            style={{ float: 'right', marginTop: '' }}
                            className={'switch'}
                          >
                            <SwitchButton
                              type={'dayNight'}
                              isStting={true}
                              status={isJudge(
                                this.props.theme.id === 'space'
                              )(true, false)}
                            />
                          </div>,
                          <span
                            style={isJudge(item.info)(
                              isJudge(item.info === 'about')(
                                { top: ' 0.3rem ', color: infoColor },
                                { top: 0, color: infoColor }
                              ),
                              isJudge(item.title === '邮箱地址')(
                                { top: ' 0.3rem ', color: infoColor },
                                { color: infoColor }
                              )
                            )}
                          >
                            {isJudge(!item.info)(
                              item.log,
                              isJudge(item.info === 'about')(
                                '',
                                '已绑定'
                              )
                            )}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )
            })}
            <ul style={{ background, color, boxShadow }}>
              <li
                style={{ background, color }}
                onClick={() => {
                  this.props.dispatch({
                    type: asyncSetTheme,
                    payload: isJudge(this.props.theme.id === 'default')('space', 'default')
                  })
                }}
              >点击1秒后通知切换主题</li>
            </ul>
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export default withRouter(Setting)
