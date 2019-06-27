import React from 'react'
import { observer } from 'mobx-react'

@observer
class Timer extends React.Component {
  componentDidMount () {
    const { appState } = this.props
    setInterval(appState.tick, 1000)
  }

  render () {
    return (
      <button onClick={this.onReset.bind(this)}>
        Seconds passed: {this.props.appState.timer}
      </button>
    )
  }

  onReset () {
    this.props.appState.resetTimer()
  }
}

export default Timer
