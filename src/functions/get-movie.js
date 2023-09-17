class getMovie {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjY5ZmU0MmMyNmMzNWQ1MzdhNWU2NDM0NDEwODgxOSIsInN1YiI6IjY0ZTc4YWQ1YzYxM2NlMDBlYWE4NTQ1ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5L40Z7vy30xXVr7fED-PQ0GSFZGIf-ZvBjm1NAgfthc',
    },
  };
  async get(text, page) {
    const options = { ...this.options };

    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${text}&include_adult=false&language=ru-RU&page=${page}&api_key=6669fe42c26c35d537a5e64344108819`,
      options
    );
    let movies = await response.json();
    return movies;
  }

  async createSession() {
    const options = { ...this.options };

    let response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options);
    let data = await response.json();
    return data.guest_session_id;
  }

  addRate(rate, session, id) {
    const options = {
      ...this.options,
      method: 'POST',
      headers: { ...this.options.headers, 'Content-Type': 'application/json;charset=utf-8' },
      body: `{"value": ${rate}}`,
    };
    delete options.headers.Authorization;

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?guest_session_id=${session}&api_key=6669fe42c26c35d537a5e64344108819`,
      options
    );
  }

  async getRated(session, page) {
    const options = { ...this.options };
    delete options.headers.Authorization;
    let request = await fetch(
      `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?language=ru-RU&page=${page}&sort_by=created_at.asc&api_key=6669fe42c26c35d537a5e64344108819`,
      options
    );
    return request.json();
  }

  async getGenres() {
    const options = { ...this.options };

    let request = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options);
    let data = await request.json();

    return data.genres;
  }
}

export default getMovie;
