import { connect } from 'react-redux'
import React from 'react'
import './hacker-news-component.css'
import { ping } from '../redux/pingAction'

const Link = ({ title, url }) => {
  return (
    <div className="news-link">
      <a href={url}>{title}</a>
    </div>
  )
}

const List = ({ items }) => {
  return items.map((item, index) => <Link key={index} {...item} />)
}

const HackerNews = ({ items, isPinging, dispatch }) => {
  // if (items.length === 0) {
  //   return <div className="weather-root widget">Loading News...</div>
  // }

  console.debug('dispatch', dispatch)

  return <>
    <div className="news-root widget">
      <h2>Hacker News - Top 5</h2>
      <List items={items} />
    </div>
    <div>
      <h2>is pinging: {isPinging.toString()}</h2>
      <button type="button" onClick={() => dispatch(ping())}>ping</button>
    </div>
  </>
}

const mapStateToProps = state => {
  return {
    items: state.hackerNews ? state.hackerNews.items : [],
    isPinging: state.ping.isPinging
  }
}

export const ConnectedHackerNews = connect(mapStateToProps)(HackerNews)
