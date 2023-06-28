import {DocumentType} from '@typegoose/typegoose';
import {FilmEntity} from './film.entity';

export interface WatchlistServiceInterface {
  findByUserId(userId: string): Promise<DocumentType<FilmEntity>[]>;
  delete(userId: string, filmId: string): Promise<void | null>;
  add(userId: string, filmId: string): Promise<void>;
}
