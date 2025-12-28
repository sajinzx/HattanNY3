
import { TicketType, TicketPrice } from './types';

export const TICKET_PRICES: TicketPrice = {
  [TicketType.STAG]: 6500,
  [TicketType.COUPLE]: 6000,
  [TicketType.ANGELS]: 2000
};

export const MAX_CAPACITY = 250;

export const THEME_COLOR = 'indigo-600';
