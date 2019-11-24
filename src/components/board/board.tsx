import * as React from 'react';
import { useState } from 'react';

import { Item } from '../../type/item';
import { Card } from '../../type/card';
import CardListC from '../card/card-list';


const initVal: Array<Item> = [
  new Item(1, "name1", [
    new Card(1, "title1", "firstName1", "lastName1", "txt1"),
    new Card(5, "title5", "firstName5", "lastName5", "txt5")
  ]),
  new Item(2, "name2", [
    new Card(2, "title2", "firstName2", "lastName2", "txt2")
  ]),
  new Item(3, "name3", [
    new Card(3, "title3", "firstName3", "lastName3", "txt3")
  ]),
  new Item(4, "name4", [
    new Card(4, "title4", "firstName4", "lastName4", "txt4")
  ]),
];

interface Props { }

export const Board = (props: Props) => {
  const [items, setItems] = useState(initVal);

  function deleteCard(cardId: number) {
    setItems(items.map(item =>
      Object.assign(item, { cards: item.cards.filter(card => card.id != cardId) })
    ));
  }

  const moveCard = (dragCard: Card, dragId: number, dragIndex: number, hoverId: number, hoverIndex: number) => {
    const exclusionList = items.map(item =>
      Object.assign(item, { cards: item.cards.filter(card => card.id != dragId) })
    );

    const nextItems = exclusionList.map(item => {
      const cards = item.cards;
      const nextCards: Array<Card> = ((curHoverIndex: number) => {
        if (curHoverIndex >= 0) {
          if (dragIndex >= hoverIndex) {
            return Array.prototype.concat.call(cards.slice(0, curHoverIndex), dragCard, cards.slice(curHoverIndex));
          } else {
            return Array.prototype.concat.call(cards.slice(0, curHoverIndex + 1), dragCard, cards.slice(curHoverIndex + 1));
          }

        } else {
          return cards;
        }
      })(item.cards.findIndex(card => card.id == hoverId));
      return Object.assign(item, { cards: nextCards });
    });

    setItems(nextItems);
  };

  const newListCard = (dragCard: Card, listId: number) => {
    const exclusionList = items.map(item =>
      Object.assign(item, { cards: item.cards.filter(card => card.id != dragCard.id) })
    );
    const nextItems = exclusionList.map(item =>
      item.id == listId ?
        Object.assign(item, { cards: Array.prototype.concat.call(item.cards, dragCard) })
        : Object.assign(item));
    setItems(nextItems);
  };

  return (
    <div style={{ height: '100%' }}>
      {items.map((item, i) =>
        <CardListC
          key={i}
          item={item}
          x={i}
          moveCard={moveCard}
          deleteCard={deleteCard}
          newListCard={newListCard}
        />
      )}
    </div>
  );
};
