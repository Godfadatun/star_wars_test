import { theResponse } from '../utils/interface';
import { ResourceNotFoundError } from '../utils/errors';
import { getQueryRunner } from '../database/helpers/db';
import { createCommentDTO, getFilmDTO } from './dto/commentDTO';
import { commentSchema, getFilmSchema } from '../authSchema/commentSchema';
import { Comments } from '../database/models/Comment';
import { getSwapiCharactersAPI, getSwapiFilmsAPI } from '../integrations/swapi';
import logger from '../utils/logger';

export const createComment = async (data: createCommentDTO): Promise<theResponse> => {
  const validation = commentSchema.validate(data);
  if (validation.error) return ResourceNotFoundError(validation.error);

  const queryRunner = await getQueryRunner();
  try {
    await queryRunner.manager.save(Comments, {
      commenter_ip: String(data.commenter_ip),
      movie_id: data.movie_id,
      comment: data.comment,
    });

    return {
      success: true,
      message: 'Comment added successfully',
    };
  } catch (e) {
    await queryRunner.rollbackTransaction();
    return {
      success: false,
      message: 'Adding Comments failed, kindly try again',
    };
  } finally {
    await queryRunner.release();
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getFilmList = async ({ character, film_index, viewComment }: any): Promise<theResponse> => {
  const validation = getFilmSchema.validate({ character, film_index, viewComment });
  if (validation.error) return ResourceNotFoundError(validation.error);

  const queryRunner = await getQueryRunner();
  try {
    if (!film_index) {
      const allFilms = await getSwapiFilmsAPI(film_index);
      return {
        success: true,
        message: 'film gotten successfully',
        data: allFilms.data.results,
      };
    }

    const film = await getSwapiFilmsAPI(film_index);
    if (!film.success)
      return {
        ...film,
        message: `Can not get film`,
      };

    const { opening_crawl, title } = film.data;

    const film_comments = await queryRunner.manager.find(Comments, {
      where: [{ movie_id: film_index }],
    });

    if (!film_comments)
      return {
        success: false,
        message: 'No comments',
      };

    const newData = {
      title,
      opening_crawl,
      comment_count: film_comments.length,
      ...(viewComment && { comments: film_comments }),
    };

    if (character) {
      const characterResult = await Promise.all(
        film.data.characters.map((single_character: string) =>
          getSwapiCharactersAPI(single_character.split('/')[single_character.split('/').length - 2]),
        ),
      );

      return {
        success: true,
        message: 'Films gotten successfully',
        data: { ...newData, characterResult },
      };
    }

    return {
      success: true,
      message: 'film gotten successfully',
      data: { ...newData },
    };
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: 'Getting Film failed, kindly try again',
    };
  } finally {
    await queryRunner.release();
  }
};
