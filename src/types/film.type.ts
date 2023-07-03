import {User} from './user.type.js';

export enum Genre {
  Comedy = 'comedy',
  Crime = 'crime',
  Documentary = 'documentary',
  Drama = 'drama',
  Horror = 'horror',
  Family = 'family',
  Romance = 'romance',
  SciFi = 'scifi',
  Thriller = 'thriller',
}

export interface Film {
  title: string;
  description: string;
  publicationDate: Date;
  genre: Genre[];
  realiseDate: Date;
  rating: number;
  previewVideo: string;
  videoLink: string;
  actors: string[];
  director: string;
  duration: number;
  commentsCount: number;
  user: User;
  poster: string;
  backgroundImage: string;
  backgroundColor: string;
}
