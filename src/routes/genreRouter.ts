import { Router } from 'express';
import { GenreController } from '../controller/GenreController';

const genreRouter = Router();
const controller = new GenreController();

genreRouter.post('/api/v1/genres', controller.createGenre);

export default genreRouter;
