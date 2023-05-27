import { User } from '../../types/user.type.js';
import typegoose, {defaultClasses, getModelForClass, modelOptions} from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/index.js';

const { prop } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, unique: true, match: /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/ })
  public email!: string ;

  @prop({ required: false, match: /\.(jpe?g|png)$/i, default: '' })
  public avatar?: string;

  @prop({ required: true, minlength: 1, maxlength: 15, default: '' })
  public name!: string;

  @prop({ required: true })
  public password!: string;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
