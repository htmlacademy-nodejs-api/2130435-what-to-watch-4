import {DocumentType} from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmEntity } from './film.entity.js';
import {Genre} from '../../types/film.type.js';
import UpdateFilmDto from './dto/update-film.dto.js';

export interface FilmServiceInterface {
  //films
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  find(count?: number): Promise<DocumentType<FilmEntity>[]>;

  //film
  findByFilmId(categoryId: string): Promise<DocumentType<FilmEntity> | null>;
  updateFilmById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteFilmById(filmId: string): Promise<DocumentType<FilmEntity> | null>;

  //genre
  findByGenre(genre: Genre): Promise<DocumentType<FilmEntity>[]>;

  //promo
  findPromoFilm(): Promise<DocumentType<FilmEntity>[]>;

  //watch-list
  findWatchListFilms(): Promise<DocumentType<FilmEntity>[]>;
  deleteFilmFromWatchList(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  addFilmToWatchList(filmId: string): Promise<DocumentType<FilmEntity> | null>;

  //general
  findByFilmNameOrCreate(filmName: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  incCommentsCount(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  calcRating(filmId: string, rating: number): Promise<DocumentType<FilmEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
