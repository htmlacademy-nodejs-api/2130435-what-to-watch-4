import {inject, injectable} from 'inversify';
import {Controller} from '../../core/controller/controller.abstract.js';
import {AppComponent} from '../../types/app-components.enum.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {FilmServiceInterface} from './film-service.interface.js';
import FilmRdo from './rdo/film.rdo.js';
import {fillDto} from '../../core/helpers/index.js';
import CreateFilmDto from './dto/create-film.dto';
import {StatusCodes} from 'http-status-codes';
import {Genre} from '../../types/film.type.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.FilmServiceInterface) protected readonly filmsService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create });

    this.addRoute({path: '/:filmId', method: HttpMethod.Get, handler: this.indexFilm });
    this.addRoute({path: '/:filmId', method: HttpMethod.Put, handler: this.update });
    this.addRoute({path: '/:filmId', method: HttpMethod.Delete, handler: this.delete });

    this.addRoute({path: '/:genre', method: HttpMethod.Get, handler: this.indexGenre });

    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.indexPromo });

    this.addRoute({path: '/watch-list', method: HttpMethod.Get, handler: this.indexWatchList });
    // this.addRoute({path: '/watch-list/:filmId', method: HttpMethod.Post, handler: this.create });
    // this.addRoute({path: '/watch-list/:filmId', method: HttpMethod.Delete, handler: this.create });

  }

  public async index(_req: Request, res: Response) {
    const films = await this.filmsService.find();
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async indexFilm(req: Request, res: Response) {
    const films = await this.filmsService.findByFilmId(req.params.filmId);
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async indexGenre(req: Request, res: Response) {
    const films = await this.filmsService.findByGenre(req.params.genre as Genre);
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async indexPromo(_req: Request, res: Response) {
    const films = await this.filmsService.findPromoFilm();
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async indexWatchList(_req: Request, res: Response) {
    const films = await this.filmsService.findWatchListFilms();
    const filmsToResponse = fillDto(FilmRdo, films);
    this.ok(res, filmsToResponse);
  }

  public async create(
    { body }: Request<
      Record<string, unknown>, Record<string, unknown>, CreateFilmDto
    >,
    res: Response
  ) {
    const existFilm = await this.filmsService.findByFilmTitle(body.title);

    if (existFilm) {
      const errorMessage = `Film with title ${body.title} already exists`;
      this.send(res, StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
      return this.logger.error(errorMessage);
    }

    const result = await this.filmsService.create(body);
    this.created(res,fillDto(FilmRdo, result));
  }

  public async update(
    { body, params }: Request<
      Record<string, unknown>, Record<string, unknown>, CreateFilmDto
    >,
    res: Response
  ) {
    const findFilm = await this.filmsService.findByFilmId(params.filmId as string);

    if (!findFilm) {
      const errorMessage = `Film with id ${params.filmId} not find`;
      this.send(res, StatusCodes.NOT_FOUND, errorMessage);
      return this.logger.error(errorMessage);
    }

    const result = await this.filmsService.updateFilmById(params.filmId as string, body);
    this.created(res,fillDto(FilmRdo, result));
  }

  public async delete(
    { params }: Request<
      Record<string, unknown>, Record<string, unknown>, CreateFilmDto
    >,
    res: Response
  ) {
    const findFilm = await this.filmsService.findByFilmId(params.filmId as string);

    if (!findFilm) {
      const errorMessage = `Film with id ${params.filmId} not find`;
      this.send(res, StatusCodes.NOT_FOUND, errorMessage);
      return this.logger.error(errorMessage);
    }

    const result = await this.filmsService.deleteFilmById(params.filmId as string);
    this.noContent(res,fillDto(FilmRdo, result));
  }

}
