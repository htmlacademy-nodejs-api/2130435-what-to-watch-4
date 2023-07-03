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
    avatar,
    email,
    password,
    poster,
    backgroundImage,
    backgroundColor,
  ] = filmData.replace('\n', '').split('\t');

  const user = {
    name,
    avatar,
    email,
    password
  };

  return ({
    title,
    description,
    publicationDate: new Date(publicationDate),
    genre: genre.split(','),
    realiseDate: new Date(realiseDate),
    rating: +rating,
    previewVideo,
    videoLink,
    actors: actors.split(','),
    director,
    duration: +duration,
    user: user,
    poster,
    backgroundImage,
    backgroundColor,
  }) as Film;
}
