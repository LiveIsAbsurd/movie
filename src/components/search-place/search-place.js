import React from 'react';
import { debounce } from 'lodash';
import { Input } from 'antd';

import './search-place.css';

export default class SearchPlace extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  componentDidMount() {
    this.input.current.focus();
  }
  searchDebouce = debounce(this.props.changeSearch, 500);
  onChange(e) {
    this.searchDebouce(e.target.value);
  }
  render() {
    return (
      <Input ref={this.input} placeholder="Введите запрос" className="search" onChange={(e) => this.onChange(e)} />
    );
  }
}
