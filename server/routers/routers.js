import express from "express";
import { getThePaste, getPastesTotal, createThePaste } from "../MongoDB_Controllers/pastes_controllers.js";

const router = express.Router();

router.get('/', (req, res) => {
  res.send('server is running...');
})

router.post('/add', createThePaste);
router.get('/get/:nan_id', getThePaste);
router.get('/getall', getPastesTotal);

export default router;