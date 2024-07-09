import express from 'express';
import { TradeController } from '../controllers/tradeController';

const router = express.Router();
const tradeController = new TradeController();

router.post('/', tradeController.createTrade);
router.get('/user/:userId', tradeController.getTrades);
router.put('/status', tradeController.updateTradeStatus);

export default router;