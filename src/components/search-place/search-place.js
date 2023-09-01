import React from 'react';
import { debounce } from 'lodash';
import { Input } from 'antd';

import './search-place.css';

export default class SearchPlace extends React.Component {
  searchDebouce = debounce(this.props.changeSearch, 500);
  onChange(e) {
    this.searchDebouce(e.target.value);
  }
  render() {
    return <Input placeholder="Введите запрос" className="search" onChange={(e) => this.onChange(e)} />;
  }
}
