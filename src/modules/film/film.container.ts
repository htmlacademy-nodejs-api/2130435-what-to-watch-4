import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import {FilmEntity, FilmModel} from './film.entity.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { AppComponent } from '../../types/app-components.enum.js';
import FilmService from './film.service.js';
import {ControllerInterface} from '../../core/controller/controller.interface.js';
import FilmController from './ film.controller.js';
import WatchlistService from './watchlist.service.js';

export function createFilmContainer() {
  const filmContainer = new Container();

  filmContainer.bind<FilmServiceInterface>(AppComponent.FilmServiceInterface).to(FilmService).inSingletonScope();
  filmContainer.bind<types.ModelType<FilmEntity>>(AppComponent.FilmModel).toConstantValue(FilmModel);
  filmContainer.bind<ControllerInterface>(AppComponent.FilmController).to(FilmController).inSingletonScope();
  filmContainer.bind<WatchlistService>(AppComponent.WatchlistServiceInterface).to(WatchlistService).inSingletonScope();

  return filmContainer;
}
