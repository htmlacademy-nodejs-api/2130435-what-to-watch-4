type RatingComment = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Comment = {
  text: string;
  rating: RatingComment;
  publicationDate: string;
  user: string;
}
