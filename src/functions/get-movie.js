class getMovie {
  async get(text, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjY5ZmU0MmMyNmMzNWQ1MzdhNWU2NDM0NDEwODgxOSIsInN1YiI6IjY0ZTc4YWQ1YzYxM2NlMDBlYWE4NTQ1ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5L40Z7vy30xXVr7fED-PQ0GSFZGIf-ZvBjm1NAgfthc',
      },
    };

    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${text}&include_adult=false&language=en-US&page=${page}`,
      options
    );
    let movies = await response.json();
    console.log(movies);
    return movies;
  }
}

export default getMovie;
