import { Genre} from '../../types/film.type.js';
import typegoose, {defaultClasses, getModelForClass, modelOptions, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';

const { prop } = typegoose;

export interface FilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: 2, maxlength: 100})
  public title!: string;

  @prop({required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: false, default: new Date()})
  public publicationDate!: Date;

  @prop({required: true, enum: Genre, type: String})
  public genre!: Genre[];

  @prop({required: true})
  public realiseDate!: string;

  @prop({required: false, default: 0})
  public rating!: number;

  @prop({required: true, match: /https?:\/\//g})
  public previewVideo!: string;

  @prop({required: true, match: /https?:\/\//g})
  public videoLink!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true, minlength: 2, maxlength: 50})
  public director!: string;

  @prop({required: true})
  public duration!: number;

  @prop({required: false, default: 0})
  public commentsCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public user!: Ref<UserEntity>;

  @prop({required: true, match: /\.jpg$/i })
  public poster!: string;

  @prop({required: true})
  public backgroundImage!: string;

  @prop({required: true})
  public backgroundColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
