// src/utils/ammUtils.ts
import Event from '../models/Event';

export const calculatePrice = (event: any, outcome: 'YES' | 'NO', shares: number): number => {
  const qYes = event.qYes;
  const qNo = event.qNo;
  const b = event.b;

  if (outcome === 'YES') {
    return Math.exp(qYes / b) / (Math.exp(qYes / b) + Math.exp(qNo / b));
  } else {
    return Math.exp(qNo / b) / (Math.exp(qYes / b) + Math.exp(qNo / b));
  }
};
