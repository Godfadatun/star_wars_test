export interface createCommentDTO {
  commenter_ip: string | string[] | null;
  comment: string;
  movie_id: string;
}

export interface getFilmDTO {
  character: 'characters';
  film_index: string;
  viewComment: 'comments';
  gender?: 'male' | 'female';
  height?: number;
}

export interface getFilmCharactersDTO {
  film_index: string;
  gender?: 'male' | 'female' | 'not-available';
  height?: number;
  operator?: 'greaterThan' | 'lessThan' | 'equalto';
}

export interface genderCharactersDTO {
  success: boolean;
  message: string;
  data: {
    characterResult: any[];
    metadata: any;
    title: any;
    opening_crawl: any;
  };
}
