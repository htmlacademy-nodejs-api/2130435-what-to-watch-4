import {IsEmail, IsString, MaxLength, MinLength} from 'class-validator';
import {UserPasswordValid} from '../../../types/validate-params.enum.js';

export default class LoginUserDto {
  @IsString({message: 'email is required'})
  @IsEmail({}, {message: 'email must be a valid email'})
  public email!: string;

  @IsString()
  @MinLength(UserPasswordValid.MinLength,
    {message: `Password must be at least ${UserPasswordValid.MinLength} characters long`}
  )
  @MaxLength(UserPasswordValid.MaxLength,
    {message: `Password must be at most ${UserPasswordValid.MaxLength} characters long`}
  )
  public password!: string;
}
