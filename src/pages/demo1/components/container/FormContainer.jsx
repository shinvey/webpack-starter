import React, { Component } from 'react'
import Input from '../presentational/Input.jsx'

class FormContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      seoTitle: ''
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.id]: event.target.value })
  }

  render () {
    const { seoTitle } = this.state
    return (
      <form id="article-form">
        <Input
          text="SEO title"
          label="seo_title"
          type="text"
          id="seo_title"
          value={seoTitle}
          handleChange={this.handleChange}
        />
      </form>
    )
  }
}

export default FormContainer
