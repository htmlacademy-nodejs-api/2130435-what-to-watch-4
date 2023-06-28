import {inject, injectable} from 'inversify';
import {AppComponent} from '../../types/app-components.enum.js';
import {ModelType} from '@typegoose/typegoose/lib/types.js';
import {FilmEntity} from './film.entity.js';
import {UserEntity} from '../user/user.entity.js';
import {WatchlistServiceInterface} from './watchlist-service.interface.js';

@injectable()
export default class WatchlistService implements WatchlistServiceInterface {
  constructor(
    @inject(AppComponent.FilmModel) private readonly filmModel: ModelType<FilmEntity>,
    @inject(AppComponent.UserModel) private readonly userModel: ModelType<UserEntity>
  ) {}

  public async findByUserId(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .exec();
    const watchlist = user?.watchlist;

    return this.filmModel
      .find({_id: {$in: watchlist}});
  }

  public async add(userId: string, filmId: string) {
    this.userModel.updateOne({user: userId}, {$push: {watchlist: filmId}});
  }

  public async delete(userId: string, filmId: string) {
    this.userModel.updateOne({user: userId}, {$pull: {watchlist: filmId}});
  }

}
