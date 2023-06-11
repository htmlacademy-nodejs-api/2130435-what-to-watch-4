import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity';
import {FilmEntity} from '../film/film.entity';


export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: 5, maxlength: 1024})
  public text!: string;

  @prop({required: true, max: 10, min: 1})
  public rating!: number;

  @prop({required: true, ref: FilmEntity})
  public filmId!: Ref<FilmEntity>;

  @prop({required: true, ref: UserEntity})
  public user!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
