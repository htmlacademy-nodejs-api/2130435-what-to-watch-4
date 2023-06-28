import {IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import {UserPasswordValid} from '../../../types/validate-params.enum.js';

export default class CreateUserDto {
  @IsString({message: 'name is required'})
  public name!: string;

  @IsString({message: 'email is required'})
  @IsEmail({}, {message: 'email must be a valid email'})
  public email!: string;

  @IsString()
  @IsOptional()
  @Matches(/.jpg/gi, {message: 'backgroundImage must be a valid image'})
  public avatar?: string;

  @IsString()
  @MinLength(UserPasswordValid.MinLength,
    {message: `Password must be at least ${UserPasswordValid.MinLength} characters long`}
  )
  @MaxLength(UserPasswordValid.MaxLength,
    {message: `Password must be at most ${UserPasswordValid.MaxLength} characters long`}
  )
  public password!: string;
}
