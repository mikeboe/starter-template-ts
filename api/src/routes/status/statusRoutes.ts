import express from 'express';
import * as statusController from '../../controllers/status/statusController';

const router = express.Router();

router.get('/', statusController.getStatus);

export { router as statusRoutes}