import React from 'react';
import { Col, Spin, Alert, Pagination } from 'antd';
import { format, isValid } from 'date-fns';

import ListRender from '../list-render';
import SearchPlace from '../search-place';
import getMovie from '../../functions/get-movie';
import './app.css';

class App extends React.Component {
  movie = new getMovie();
  state = {
    movies: [],
    loading: false,
    error: false,
    search: false,
    page: 1,
    totalPages: 0,
  };

  db = (text) => {
    this.movie
      .get(text, this.state.page)
      .then((data) => {
        this.setState({
          movies: data.results,
          loading: false,
          totalPages: data.total_pages,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true,
        });
      });
  };

  getText = (text, maxLength) => {
    if (!text) return 'Описание не найдено';
    if (text.length <= maxLength) {
      return text;
    }
    const truncated = text.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex === -1) {
      return truncated + '...';
    }
    return truncated.slice(0, lastSpaceIndex) + '...';
  };

  changeSearch = (text) => {
    if (!text.trim()) {
      return;
    }
    this.setState(
      {
        loading: true,
        search: text,
        page: 1,
      },
      () => {
        this.db(this.state.search, this.state.page);
      }
    );
  };

  selectPage = (page) => {
    this.setState(
      {
        page: page,
        loading: true,
      },
      () => {
        this.db(this.state.search, this.state, page);
      }
    );
  };

  render() {
    let { loading, error, search } = this.state;
    const elements = this.state.movies.map((el, i) => {
      let release = new Date(el.release_date);
      let releaseDate;
      if (isValid(release)) {
        releaseDate = format(release, 'MMMM d, yyyy');
      } else {
        releaseDate = 'Not found';
      }
      return (
        <Col className="col" key={i}>
          <img className="img" src={el.poster_path ? `https://image.tmdb.org/t/p/original${el.poster_path}` : ''} />
          <div className="info">
            <p className="header">{this.getText(el.original_title, 10)}</p>
            <p className="date">{releaseDate}</p>
            <div>
              <span className="genre">Action</span>
              <span className="genre">Drama</span>
            </div>
            <p className="description">{this.getText(el.overview, 200)}</p>
          </div>
        </Col>
      );
    });
    let movieList = !loading && !error ? <ListRender elements={elements} /> : null;
    let pagination =
      !loading && !error && this.state.movies.length > 0 ? (
        <Pagination
          className="pagination"
          defaultCurrent={this.state.page}
          total={this.state.totalPages + '0'}
          onChange={(e) => this.selectPage(e)}
        />
      ) : null;
    let loader = loading ? <Spin className="loader" size="large" /> : null;
    let errorDisplay = error ? (
      <Alert
        className="error"
        message="Ошибка"
        description="Нет данных от сервера. Проверьте подключение к интернету"
        type="error"
        showIcon
      />
    ) : null;
    let notFound =
      this.state.movies.length === 0 && search && !error ? (
        <Alert className="error" message="Ошибка" description="Фильм не найден" type="error" />
      ) : null;
    return (
      <div className="main">
        <div className="head-buttons">
          <button className="select">Search</button>
          <button>Rated</button>
        </div>
        <SearchPlace changeSearch={(text) => this.changeSearch(text)} />
        {movieList}
        {loader}
        {errorDisplay}
        {notFound}
        {pagination}
      </div>
    );
  }
}

export default App;
