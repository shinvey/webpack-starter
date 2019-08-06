import React from 'react'
import Timer from './Timer'
import appState from './appState'

export default function View () {
  return <Timer appState={appState}/>
}
