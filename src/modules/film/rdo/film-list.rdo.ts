import { Expose, Type } from 'class-transformer';
import {Genre} from '../../../types/film.type.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class FilmListRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public genre!: Genre;

  @Expose()
  public posterImage!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public commentCount!: number;

  @Expose()
  public publishDate!: Date;

  @Expose({ name: 'id' })
  @Type(() => UserRdo)
  public user!: UserRdo;

}
