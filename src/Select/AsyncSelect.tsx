import React, { Component } from 'react'
import BasicSelect from './BasicSelect'
import { OptionProps, SelectProps } from './props'
import { debounce } from './helpers'
import { noop } from './utils'

export default class AsyncSelect extends Component<SelectProps, { loading: boolean, options: Array<OptionProps> }> {
  cancelled = false;

  search = debounce((value: string) => {
    this.setLoader(true)
    let { onSearch = noop } = this.props
    onSearch(value)
      .then((options: Array<OptionProps>) => {
        if (!this.cancelled) {
          this.setState({
            options: [...options]
          })
        }
      })
      .catch((err: any) => {
        this.setState({
          options: []
        })
        console.error(err)
      })
      .finally(() => {
        this.setLoader(false)
        this.cancelled = false
      })
  }, 500)

  state = {
    loading: false,
    options: []
  }

  setLoader = (loading: boolean) => {
    this.setState({
      loading
    })
  }

  onInputChange = (value: string) => {
    this.setLoader(true)
    this.search(value)
  }

  onClose = () => {
    if (this.state.loading) {
      this.setLoader(false);
      this.cancelled = true;
    }
  }

  render() {
    const mergedStateAndProps = {
      ...this.props,
      ...this.state,
    }
    return (
      <BasicSelect
        {...mergedStateAndProps}
        async
        onInputChange={this.onInputChange}
        onClose={this.onClose}
      />
    )
  }
}
