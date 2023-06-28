import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../core/errors/http-error.js';
import {MiddlewareInterface} from './middleware.interface.js';
import {Genre} from '../../types/film.type.js';

export class ValidateGenreMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const genre = params[this.param];

    if ((Object.values(Genre) as string[]).includes(genre)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${genre} is invalid Genre`,
      'ValidateGenreMiddleware'
    );
  }
}
