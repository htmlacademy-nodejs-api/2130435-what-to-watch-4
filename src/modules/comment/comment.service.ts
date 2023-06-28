import {injectable, inject} from 'inversify';
import {CommentServiceInterface} from './comment-service.interface.js';
import {AppComponent} from '../../types/app-components.enum.js';
import {CommentEntity} from './comment.entity.js';
import {DocumentType, types } from '@typegoose/typegoose';
import CreateCommentDto from './dto/create-comment.dto.js';
import {SortType} from '../../types/sort-type.enum.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('user');
  }

  public async findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({filmId})
      .populate(['user', 'filmId'])
      .sort({createdAt: SortType.Asc})
      .exec();
  }
}
