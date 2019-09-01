import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import {
  ContainerPropsInterface,
  ContainerStateInterface
} from '../../components/containerInterface'
// import { HomeStoreType } from '@/reducers/homePageReducer'
import Header from '../../components/navigation/header'
import YaboStyle from './yabo.scss'
import { Scrollbars } from 'react-custom-scrollbars'
import { reactClassNameJoin, setDataStatistics } from '../../components/helpers'

interface HomeStoreType {
  // some declaration
  any: any
}

@connect(state => ({
  theme: state.switchTheme.theme
}))
class AboutUs extends React.PureComponent<
  ContainerPropsInterface<HomeStoreType>,
  ContainerStateInterface
> {
  public ybpic = {
    aboutlg: '/assets/aboutus/new_aboutus_icon.png'
  }
  public brands = [
    {
      img: '/assets/aboutus/new_aboutus_icon1.png',
      desc1: '英属维尔京群岛',
      desc2: '（BVI）认证'
    },
    {
      img: '/assets/aboutus/new_aboutus_icon2.png',
      desc1: '马耳他博彩牌照',
      desc2: '（MGA）认证'
    },
    {
      img: '/assets/aboutus/new_aboutus_icon3.png',
      desc1: '菲律宾（PAGCOR）',
      desc2: '监管博彩执照'
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
      '/app/mine/aboutUs',
      '关于我们',
      '进入关于我们页面'
    )
  }
  public createMarkup = tabs => {
    return { __html: tabs }
  }
  public renderBrands = () => {
    const { id } = this.props.theme
    const isNight = id === 'space' ? true : false
    return (
      <div className={YaboStyle.brandsBox}>
        <img className={YaboStyle.brand_logo} src={isNight ? '/assets/aboutus/license_night.png' : '/assets/aboutus/license.png' } />
      </div>
    )
  }
  public render() {
    const { background } = this.props.theme.mine.aboutUs
    const { id } = this.props.theme
    const isNight = id === 'space' ? true : false
    return (
      <div className={YaboStyle.aboutus} style={{ background }}>
        <Header history={this.props.history} title={'关于我们'} />
        <Scrollbars autoHeight autoHeightMin={document.body.clientHeight}>
          <img className={YaboStyle.logo} src={isNight ? '/assets/aboutus/logo_night.png' : '/assets/aboutus/logo_day.png' } />
          <div className={YaboStyle.yb_intro}>
            <p className={reactClassNameJoin(
              YaboStyle.text_color,
              isNight ? YaboStyle.text_color_night : null
            )}>
              BOB是全球领先的合法博彩公司，
              <br />
              拥有官方颁发的许可证并受其监督运营
            </p>
          </div>
          {this.renderBrands()}
        </Scrollbars>
      </div>
    )
  }
}

export default withRouter(AboutUs)
