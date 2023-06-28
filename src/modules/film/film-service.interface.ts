import {DocumentType} from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmEntity } from './film.entity.js';
import {Genre} from '../../types/film.type.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';

export interface FilmServiceInterface extends DocumentExistsInterface {
  //films
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  find(limitQuery?: number, skipQuery?: number): Promise<DocumentType<FilmEntity>[]>;

  //film
  findByFilmId(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findByFilmTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null>;
  updateFilmById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteFilmById(filmId: string): Promise<DocumentType<FilmEntity> | null>;

  //genre
  findByGenre(genre: Genre): Promise<DocumentType<FilmEntity>[]>;

  //promo
  findPromoFilm(): Promise<DocumentType<FilmEntity>[]>;

  //general
  findByFilmNameOrCreate(filmName: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  incCommentsCount(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  calcRating(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
