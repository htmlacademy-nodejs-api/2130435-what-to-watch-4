import {Genre} from '../../../types/film.type.js';

export default class UpdateFilmDto {
  public title?: string;
  public description?: string;
  public genre?: Genre[];
  public realiseDate?: string;
  public previewVideo?: string;
  public videoLink?: string;
  public actors?: string[];
  public director?: string;
  public duration?: number;
  public poster?: string;
  public backgroundImage?: string;
  public backgroundColor?: string;
}
