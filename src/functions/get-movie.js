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
      `https://api.themoviedb.org/3/search/movie?query=${text}&include_adult=false&language=en-US&page=${page}`,
      options
    );
    let movies = await response.json();
    console.log(movies);
    return movies;
  }

  async createSession() {
    const options = { ...this.options };

    let response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options);
    let data = await response.json();
    console.log(data.guest_session_id);
    return data.guest_session_id;
  }

  async addRate(rate, session) {
    const options = {
      ...this.options,
      method: 'POST',
      headers: { ...this.options.headers, 'Content-Type': 'application/json;charset=utf-8' },
      body: `{"value": ${rate}}`,
    };
    console.log(options);

    let request = await fetch(`https://api.themoviedb.org/3/movie/836466/rating?guest_session_id=${session}`, options);
    console.log(request.json());
  }
}

export default getMovie;
