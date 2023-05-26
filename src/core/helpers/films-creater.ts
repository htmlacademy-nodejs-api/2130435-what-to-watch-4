import {Film} from '../../types/film.type';

export function createFilm(filmData: string): Film {
  const [
    title,
    description,
    publicationDate,
    genre,
    realiseDate,
    rating,
    previewVideo,
    videoLink,
    actors,
    director,
    duration,
    name,
    email,
    password,
    poster,
    backgroundImage,
    backgroundColor,
  ] = filmData.replace('\n', '').split('\t');

  const user = {
    email,
    name,
    password
  };

  return ({
    title,
    description,
    publicationDate: new Date(publicationDate),
    genre: genre.split(','),
    realiseDate,
    rating: +rating,
    previewVideo,
    videoLink,
    actors: actors.split(','),
    director,
    duration: +duration,
    userId: user,
    poster,
    backgroundImage,
    backgroundColor,
  }) as Film;
}
