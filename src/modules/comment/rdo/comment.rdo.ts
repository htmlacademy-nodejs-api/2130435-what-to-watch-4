import {Expose, Type} from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class CommentRdo {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose({name: 'createAt'})
  public postDate!: string;

  @Expose({name: 'id'})
  @Type(() => UserRdo)
  public user!: UserRdo;
}
