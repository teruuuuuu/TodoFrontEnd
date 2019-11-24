import * as React from 'react';
import { useImperativeHandle, useRef } from 'react';
import {
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DragSourceMonitor,
} from 'react-dnd';
import {
  DragSource,
  DropTarget,
  DropTargetConnector,
  DragSourceConnector
} from 'react-dnd';

import ItemTypes from './item-types';
import { Item } from '../../type/item';
import DragCard from './card';
import { CardProps } from './card';

import { Card } from '../../type/card';


interface Props {
  item: Item,
  x: number,
  moveCard: (dragCard: Card, dragId: number, dragIndex: number, hoverId: number, hoverIndex: number) => void,
  newListCard: (dragCard: Card, listId: number) => void,
  deleteCard: (cardId: number) => void,

  isDragging: boolean,
  connectDragSource: ConnectDragSource,
  connectDropTarget: ConnectDropTarget
}

interface CardListInstance {
  getNode(): HTMLDivElement | null
}

const CardListC = React.forwardRef<HTMLDivElement, Props>(
  ({ item, x, moveCard, deleteCard, isDragging, connectDragSource, connectDropTarget }, ref) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);

    const opacity = 1;
    useImperativeHandle<{}, CardListInstance>(ref, () => ({
      getNode: () => elementRef.current,
    }));

    return (
      <div ref={elementRef} className="desk" style={{ opacity }} >
        <div className="desk-head">
          <div className="desk-name">{item.name}</div>
        </div>
        {item.cards.map((card, i) => (
          <DragCard
            key={card.id}
            x={x}
            y={i}
            card={card}
            style={{}}
            moveCard={moveCard}
            deleteCard={deleteCard}
          />
        ))}
      </div>
    );
  });

export default DropTarget(
  ItemTypes.CARD,
  {
    hover(
      props: any,
      monitor: DropTargetMonitor,
      component: CardListInstance,
    ) {

      if (!component) {
        return null;
      }
      const node = component.getNode();
      if (!node) {
        return null;
      }

      const dragCard = monitor.getItem().card;
      if (props.item.cards.length == 0) {
        props.newListCard(dragCard, props.item.id);
      } else if (props.hasOwnProperty("item")) {
        let f = true;
        let childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
          let n: any = childNodes[i];
          if (n.id == monitor.getItem().id) {
            f = false;
          }
        }
        if (f) {
          props.newListCard(dragCard, props.item.id);
        }
      }
    },
  },
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: (props: CardProps) => ({
        id: props.card.id,
        card: props.card,
        y: props.y,
        x: props.x,
      }),
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(CardListC),
);
