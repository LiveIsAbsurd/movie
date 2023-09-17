import React from 'react';
import { Spin, Alert, Pagination } from 'antd';

import ListRender from '../list-render';
import SearchPlace from '../search-place';
import getMovie from '../../functions/get-movie';
import './app.css';
import { Provider } from '../genres-context/genres-context';

class App extends React.Component {
  movie = new getMovie();
  state = {
    select: 'search',
    movies: [],
    loading: false,
    search: false,
    error: false,
    page: 1,
    totalPages: 0,
    ratedList: [],
    genres: [],
  };

  componentDidMount() {
    this.movie
      .createSession()
      .then((data) => {
        this.setState({ session: data });
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true,
        });
      });

    this.movie
      .getGenres()
      .then((data) => {
        this.setState({
          genres: data,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true,
        });
      });
  }

  getRated = async (session, page) => {
    this.setState({
      loading: true,
    });
    try {
      let list = await this.movie.getRated(session, page);
      this.setState({
        ratedList: list.results,
        select: 'rated',
        loading: false,
        totalPages: list.total_pages,
        page: 1,
        not_Found: list.results.length === 0 ? true : false,
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };

  db = (text) => {
    this.movie
      .get(text, this.state.page)
      .then((data) => {
        this.setState({
          movies: data.results,
          loading: false,
          totalPages: data.total_pages,
          not_Found: data.results.length === 0 ? true : false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true,
        });
      });
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
    let { loading, error, not_Found } = this.state;
    let elementList = this.state.select === 'search' ? this.state.movies : this.state.ratedList;
    let movieList =
      !loading && !error ? (
        <Provider value={this.state.genres}>
          <ListRender
            session={this.state.session}
            genres={this.state.genres}
            list={elementList}
            ratedList={this.state.ratedList}
          />
        </Provider>
      ) : null;
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
      not_Found && !loading && !error ? (
        <Alert className="error" message="Ошибка" description="Не найдено" type="error" />
      ) : null;
    let searchPlace =
      this.state.select === 'search' ? <SearchPlace changeSearch={(text) => this.changeSearch(text)} /> : null;
    return (
      <div className="main">
        <div className="head-buttons">
          <button
            className={this.state.select === 'search' ? 'select' : ' '}
            onClick={async () => {
              this.setState({
                loading: true,
              });
              try {
                const refreshRated = await this.movie.getRated(this.state.session, this.state.page);
                this.setState({
                  select: 'search',
                  search: false,
                  page: 1,
                  ratedList: refreshRated.results,
                  loading: false,
                  not_Found: false,
                });
              } catch (e) {
                this.setState({
                  loading: false,
                  error: true,
                });
              }
            }}
          >
            Search
          </button>
          <button
            className={this.state.select === 'rated' ? 'select' : ''}
            onClick={() => {
              this.getRated(this.state.session, this.state.page);
            }}
          >
            Rated
          </button>
        </div>
        {searchPlace}
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
