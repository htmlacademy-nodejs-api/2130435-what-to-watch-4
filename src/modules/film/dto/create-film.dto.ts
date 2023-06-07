import {Genre} from '../../../types/film.type.js';

export default class CreateFilmDto {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public genre!: Genre[];
  public realiseDate!: string;
  public rating!: number;
  public previewVideo!: string;
  public videoLink!: string;
  public actors!: string[];
  public director!: string;
  public duration!: number;
  public commentsCount!: number;
  public user!: string;
  public poster!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
}
