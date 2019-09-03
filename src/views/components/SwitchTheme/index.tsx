import * as React from 'react'
import { connect } from 'react-redux'
import { isJudge } from '../helpers'
import { Switch } from 'antd-mobile'
import {
  setThemeActionCreator
} from '@/views/components/SwitchTheme/redux/actions'

interface SliderProps {
  [random: string]: any
}

interface SliderBarState {
  [random: string]: any
}

@connect(state => ({
  theme: state.switchTheme.theme
}))
export default class SwitchButton extends React.PureComponent<
  SliderProps,
  SliderBarState
> {
  state = {
    checked: false
  }
  constructor(props) {
    super(props)
    this.state.checked = props.status
  }

  public render() {
    const { status } = this.props
    return <Switch
      onChange={(checked) => {
        this.setState({
          checked
        })
        // 切换主题
        this.props.dispatch(setThemeActionCreator(isJudge(checked)('space', 'default')))
      }}
      checked={status}
    />
  }
}
