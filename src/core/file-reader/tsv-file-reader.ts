import { FileReaderInterface } from './file-reader.interface';
import {readFileSync} from 'node:fs';
import {Film} from '../../types/film.type';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(
    public filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
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
      ]) => ({
        title,
        description,
        publicationDate: new Date(publicationDate),
        genre: genre.split(','),
        realiseDate,
        rating,
        previewVideo,
        videoLink,
        actors: actors.split(','),
        director,
        duration,
        user: {name, email, password},
        poster,
        backgroundImage,
        backgroundColor,
      }) as unknown as Film);
  }
}
