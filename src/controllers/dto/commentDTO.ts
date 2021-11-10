export interface createCommentDTO {
  commenter_ip: string | string[] | null;
  comment: string;
  movie_id: string;
}

export interface getFilmDTO {
  character: 'characters';
  film_index: string;
  viewComment: 'comments';
}
