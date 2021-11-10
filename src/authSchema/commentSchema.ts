/* eslint-disable max-classes-per-file */
import joi from 'joi';

export const commentSchema = joi.object().keys({
  commenter_ip: joi.string().required(),
  comment: joi.string().max(500).required(),
  movie_id: joi.string().required(),
});

export const getFilmSchema = joi.object().keys({
  character: joi.string().valid('characters').optional(),
  film_index: joi.string().max(500).optional(),
  viewComment: joi.string().valid('comments').optional(),
});

export const getFilmCharactersSchema = joi
  .object({
    film_index: joi.string().max(500).required(),
    gender: joi.string().valid('male', 'female', 'not-available').optional(),
    height: joi.number().integer().min(1).optional(),
    operator: joi.string().valid('greaterThan', 'lessThan', 'equalto').optional(),
  })
  .oxor('height', 'gender')
  .and('height', 'operator');

export interface Response {
  success: boolean;
  message?: string;
  error?: any;
}
