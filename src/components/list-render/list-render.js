import React from 'react';
import { Col, Row, Rate } from 'antd';
import { format, isValid } from 'date-fns';

import getMovie from '../../functions/get-movie';
import './list-render.css';
import { Consumer } from '../genres-context/genres-context';

export default class ListRender extends React.Component {
  movie = new getMovie();
  getGenres = (el, genresList) => {
    let genres = genresList.map((genEl, i) => {
      let result = [];
      el.genre_ids.forEach((element) => {
        if (element === genEl.id) {
          result.push(
            <span key={i} className="genre">
              {genEl.name}
            </span>
          );
        }
      });
      return result;
    });
    return genres;
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
  createElements = (list) => {
    const elemList = list.map((el) => {
      let starsCount;
      let foundItem = this.props.ratedList.find((ratedEl) => el.id === ratedEl.id);
      if (foundItem) {
        starsCount = foundItem.rating;
      }
      let raiting = el.vote_average.toFixed(1);
      let raitingColor;
      if (raiting <= 3) {
        raitingColor = '#E90000';
      } else if (raiting <= 5) {
        raitingColor = '#E97E00';
      } else if (raiting <= 7) {
        raitingColor = '#E9D100';
      } else {
        raitingColor = '#66E900';
      }
      let release = new Date(el.release_date);
      let releaseDate;
      if (isValid(release)) {
        releaseDate = format(release, 'MMMM d, yyyy');
      } else {
        releaseDate = 'Not found';
      }
      return (
        <Consumer key={el.id}>
          {(genres) => {
            return (
              <Col className="col">
                <img
                  className="img"
                  src={el.poster_path ? `https://image.tmdb.org/t/p/original${el.poster_path}` : ''}
                />
                <div className="info">
                  <div>
                    <div style={{ borderColor: raitingColor }} className="realRate">
                      {raiting}
                    </div>
                    <p className="header">{this.getText(el.original_title, 10)}</p>
                    <p className="date">{releaseDate}</p>
                    <div className="genres-list">{this.getGenres(el, genres)}</div>
                    <p className="description">{this.getText(el.overview, 200)}</p>
                  </div>
                  <Rate
                    className="rate"
                    count={10}
                    onChange={(count) => {
                      this.movie.addRate(count, this.props.session, el.id);
                    }}
                    defaultValue={starsCount}
                  />
                </div>
              </Col>
            );
          }}
        </Consumer>
      );
    });
    return elemList;
  };
  render() {
    const elements = this.createElements(this.props.list);
    return (
      <React.Fragment>
        <Row justify={'space-evenly'} className="row">
          {elements}
        </Row>
      </React.Fragment>
    );
  }
}
