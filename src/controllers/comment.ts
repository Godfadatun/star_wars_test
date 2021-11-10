/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { theResponse } from '../utils/interface';
import { ResourceNotFoundError } from '../utils/errors';
import { getQueryRunner } from '../database/helpers/db';
import { createCommentDTO, genderCharactersDTO, getFilmCharactersDTO, getFilmDTO } from './dto/commentDTO';
import { commentSchema, getFilmCharactersSchema, getFilmSchema } from '../authSchema/commentSchema';
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

export const getFilmList = async ({ character, film_index, viewComment }: any): Promise<theResponse> => {
  const validation = getFilmSchema.validate({ character, film_index, viewComment });
  if (validation.error) return ResourceNotFoundError(validation.error);

  const queryRunner = await getQueryRunner();
  try {
    if (!film_index) {
      const allFilms = await getSwapiFilmsAPI(film_index);
      const newDate: any = (data: string) => new Date(data);

      const films = allFilms.data.results.sort((a: any, b: any) => newDate(b.release_date) - newDate(a.release_date));
      return {
        success: true,
        message: 'film gotten successfully',
        data: films,
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
      order: { id: 'DESC' },
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

const converCMToFeetAndInches = (data: number): string => {
  const newfeet = `${data / 30.48}`.split('.');
  const inches = Number(`0.${newfeet[1]}`) * 12;

  return `${newfeet[0]}ft ${inches.toFixed(2)}In`;
};

export const getFilmCharactersList = async ({ film_index, height, gender, operator }: any): Promise<theResponse> => {
  const validation = getFilmCharactersSchema.validate({ film_index, height, gender, operator });
  if (validation.error) return ResourceNotFoundError(validation.error);

  const queryRunner = await getQueryRunner();
  try {
    const film = await getSwapiFilmsAPI(film_index);
    if (!film.success)
      return {
        ...film,
        message: `Can not get film`,
      };

    const { opening_crawl, title } = film.data;

    const newData = { title, opening_crawl };

    const characterResult = await Promise.all(
      film.data.characters.map((single_character: string) =>
        getSwapiCharactersAPI(single_character.split('/')[single_character.split('/').length - 2]),
      ),
    );

    const genderCharacters: genderCharactersDTO = {
      success: true,
      message: 'Film Characters gotten successfully',
      data: { ...newData, characterResult: [], metadata: {} },
    };

    if (gender) {
      if (gender === 'not-available') {
        const others = characterResult.filter((character: any) => character.data.gender === 'n/a');
        genderCharacters.data.characterResult = others;
        genderCharacters.data.metadata = { numberOfCharacters: others.length };
        return genderCharacters;
      }

      const binaryGender = characterResult.filter((character: any) => character.data.gender === gender);
      genderCharacters.data.characterResult = binaryGender;
      genderCharacters.data.metadata = { numberOfCharacters: binaryGender.length };
      return genderCharacters;
    }

    if (height) {
      let newHeight: any;
      if (operator === 'greaterThan')
        newHeight = characterResult.filter((character: any) => {
          if (Number(character.data.height) > Number(height)) character.data.heightInFeet = converCMToFeetAndInches(Number(character.data.height));
          return Number(character.data.height) > Number(height);
        });
      if (operator === 'lessThan')
        newHeight = characterResult.filter((character: any) => {
          if (Number(character.data.height) < Number(height)) character.data.heightInFeet = converCMToFeetAndInches(Number(character.data.height));
          return Number(character.data.height) < Number(height);
        });
      if (operator === 'equalto')
        newHeight = characterResult.filter((character: any) => {
          if (Number(character.data.height) === Number(height)) character.data.heightInFeet = converCMToFeetAndInches(Number(character.data.height));
          return Number(character.data.height) === Number(height);
        });

      const others = newHeight.sort((a: any, b: any) => Number(a.data.height) - Number(b.data.height));
      genderCharacters.data.characterResult = others;
      genderCharacters.data.metadata = { numberOfCharacters: others.length };
      return genderCharacters;
    }

    genderCharacters.data.characterResult = characterResult;
    genderCharacters.data.metadata = { numberOfCharacters: characterResult.length };
    return genderCharacters;
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: 'Getting Film Characters failed, kindly try again',
    };
  } finally {
    await queryRunner.release();
  }
};
