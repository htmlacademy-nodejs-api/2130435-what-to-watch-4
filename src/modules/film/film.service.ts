import {inject, injectable} from 'inversify';
import {DocumentType, ModelType} from '@typegoose/typegoose/lib/types.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {AppComponent} from '../../types/app-components.enum.js';
import {FilmServiceInterface} from './film-service.interface.js';
import CreateFilmDto from './dto/create-film.dto.js';
import {FilmEntity} from './film.entity.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import {Genre} from '../../types/film.type.js';
import {DEFAULT_FILM_COUNT} from './film.constant.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.FilmModel) private readonly filmModel: ModelType<FilmEntity>
  ) {}

  //films
  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.title}`);
    return result;
  }

  public async find(limitQuery?:number, skipQuery?:number): Promise<DocumentType<FilmEntity>[]> {
    const limit = limitQuery ?? DEFAULT_FILM_COUNT;
    const skip = skipQuery ?? 0;
    return this.filmModel
      .find({}, {}, {
        skip,
        limit
      })
      .populate('user')
      .exec();
  }

  //film
  public async findByFilmId(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(filmId)
      .populate('user')
      .exec();
  }

  public async findByFilmTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findOne({title: filmTitle})
      .populate('user')
      .exec();
  }

  public async updateFilmById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, {new: true})
      .populate('user')
      .exec();
  }

  public async deleteFilmById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  //genre
  public async findByGenre(genre: Genre): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .find({genre})
      .exec();
  }

  //promo
  public async findPromoFilm(): Promise<DocumentType<FilmEntity>[]> {
    const randomIndex = Math.floor(Math.random() * 10);

    return this.filmModel
      .find({}, {}, {
        limit: 1,
        skip: randomIndex
      })
      .populate('user')
      .exec();
  }

  //watch-list
  public async findWatchListFilms(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .find({watchList: true})
      .exec();
  }

  public async deleteFilmFromWatchList(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {watchList: false}, {new: true})
      .exec();
  }

  public async addFilmToWatchList(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {watchList: true}, {new: true})
      .exec();
  }

  //general
  public async findByFilmNameOrCreate(filmName: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const existedFilm = await this.findByFilmName(filmName);

    if (existedFilm) {
      return existedFilm;
    }

    return this.create(dto);
  }

  public async incCommentsCount(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {'$inc': {
        commentsCount: 1
      }}).exec();
  }

  public async calcRating(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    const aggregation = [
      { $match: { _id: filmId } }, // Находим фильм по идентификатору
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'filmId',
          as: 'comments',
        },
      },
      {
        $group: {
          _id: '$_id',
          rating: { $avg: '$comments.rating' }, // Рассчитываем средний рейтинг комментариев
        },
      },
    ];

    const result = await this.filmModel.aggregate(aggregation).exec();

    if (result.length === 0) {
      return null;
    }

    const rating = result[0].rating;

    return await this.filmModel.findByIdAndUpdate(filmId, {rating}, {new: true}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return await this.filmModel.exists({_id: documentId}) !== null;
  }

  public async findByFilmName(filmName: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({name: filmName}).exec();
  }
}
