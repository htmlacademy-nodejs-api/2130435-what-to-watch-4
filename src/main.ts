import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './app/rest.js';
import {AppComponent} from './types/app-components.enum.js';
import {createRestApplicationContainer} from './app/rest.container.js';
import { createUserContainer } from './modules/user/user.container.js';
import {createFilmContainer} from './modules/film/film.container.js';
import {createCommentContainer} from './modules/comment/comment.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createFilmContainer(),
    createCommentContainer(),
  );

  const application = mainContainer.get<RestApplication>(AppComponent.RestApplication);
  await application.init();
}

bootstrap();
