import {Expose, Type} from 'class-transformer';
import {Genre} from '../../../types/film.type.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class FilmRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public genre!: Genre[];

  @Expose()
  public realiseDate!: string;

  @Expose()
  public previewVideo!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public duration!: number;

  @Expose({name: 'user'})
  @Type(() => UserRdo)
  public user!: UserRdo;

  @Expose()
  public poster!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;
}
