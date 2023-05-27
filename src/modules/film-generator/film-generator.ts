import {FilmGeneratorInterface} from './film-generator.interface.js';
import type {MockData} from '../../types/mock-data.type.js';
import {generateRandomValue, getRandomItem, getRandomItems} from '../../core/helpers/index.js';
import {Genre} from '../../types/film.type.js';
import dayjs from 'dayjs';

enum MathDayWeek {
  Min = 1,
  Max = 7
}

export default class FilmGenerator implements FilmGeneratorInterface{
  constructor(private readonly MockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.MockData.titles);
    const description = getRandomItem<string>(this.MockData.descriptions);
    const publicationDate = dayjs()
      .subtract(
        generateRandomValue(MathDayWeek.Min, MathDayWeek.Max), 'day'
      ).toISOString();

    const genre = getRandomItems([
      Genre.Comedy, Genre.Crime, Genre.Documentary, Genre.Drama,
      Genre.Horror, Genre.Family, Genre.Romance, Genre.SciFi, Genre.Thriller]
    );

    const realiseDate = getRandomItem<string>(this.MockData.realiseDates);
    const rating = getRandomItem<number>(this.MockData.rating);
    const previewVideo = getRandomItem<string>(this.MockData.previewsVideo);
    const videoLink = getRandomItem<string>(this.MockData.videoLinks);
    const actors = getRandomItem<string[]>(this.MockData.actors).join(', ');
    const director = getRandomItem<string>(this.MockData.directors);
    const duration = getRandomItem<number>(this.MockData.durations);
    const userName = getRandomItem<string>(this.MockData.userNames);
    const userAvatar = getRandomItem<string>(this.MockData.userAvatars);
    const userEmail = getRandomItem<string>(this.MockData.userEmails);
    const userPassword = getRandomItem<string>(this.MockData.userPasswords);
    const poster = getRandomItem<string>(this.MockData.posters);
    const backgroundImage = getRandomItem<string>(this.MockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.MockData.backgroundColors);
    return [
      title, description, publicationDate,
      genre, realiseDate, rating, previewVideo,
      videoLink, actors, director, duration,
      userName, userAvatar, userEmail, userPassword,
      poster, backgroundImage, backgroundColor
    ].join('\t');
  }
}
