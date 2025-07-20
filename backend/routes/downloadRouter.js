import express from 'express';
import { downloadTrack } from '../controllers/downloadController.js';

const router = express.Router();

const downloadRoute =  (io) => {
  router.post('/', (req, res) => downloadTrack(req, res, io));
  return router;
};

export default downloadRoute