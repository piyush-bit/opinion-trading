import Trade, { ITrade } from '../models/Trade';
import Event from '../models/Event'; // Assuming you have an Event model
import { UserService } from './userService';

export class TradingService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  private b = 100; // Liquidity parameter, adjust as needed

  async createTrade(tradeData: Partial<ITrade>): Promise<ITrade> {
    const event = await Event.findById(tradeData.eventId);
    if (!event) throw new Error('Event not found');

    const currentPrice = this.calculatePrice(event.yesShares, event.noShares);
    const trade = new Trade({
      ...tradeData,
      price: tradeData.position === 'yes' ? currentPrice.yes : currentPrice.no,
    });

    await this.updateEventShares(event, trade);
    return await trade.save();
  }

  private calculatePrice(yesShares: number, noShares: number) {
    const yes = Math.exp(yesShares / this.b) / (Math.exp(yesShares / this.b) + Math.exp(noShares / this.b));
    return { yes, no: 1 - yes };
  }

  private async updateEventShares(event: any, trade: ITrade) {
    if (trade.position === 'yes') {
      event.yesShares += trade.amount;
    } else {
      event.noShares += trade.amount;
    }
    await event.save();
  }

  async getUserTrades(userId: string): Promise<ITrade[]> {
    return await Trade.find({ userId }).sort({ createdAt: -1 });
  }

  async getEventTrades(eventId: string): Promise<ITrade[]> {
    return await Trade.find({ eventId }).sort({ createdAt: -1 });
  }

  async cancelTrade(tradeId: string, userId: string): Promise<ITrade | null> {
    const trade = await Trade.findOne({ _id: tradeId, userId, status: 'pending' });
    if (!trade) return null;

    trade.status = 'cancelled';
    return await trade.save();
  }

  async resolveEvent(eventId: string, outcome: 'yes' | 'no'): Promise<void> {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    const trades = await Trade.find({ eventId, status: 'executed' });
    for (const trade of trades) {
      if (trade.position === outcome) {
        const payout = trade.amount / (trade.position === 'yes' ? event.yesShares : event.noShares);
        await this.userService.updateUserBalance(trade.userId, payout);
      }
    }

    event.status = 'resolved';
    event.outcome = outcome;
    await event.save();
  }
}