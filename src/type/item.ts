import { Card } from './card';

export class Item {
  id: number;
  name: string;
  cards: Array<Card>;

  constructor(id: number, name: string, cards: Array<Card>) {
    this.id = id;
    this.name = name;
    this.cards = cards;
  }
}
