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
  DragSourceConnector,
} from 'react-dnd';
import ItemTypes from './item-types';

import { Card } from '../../type/card';

const galPng = require('../../assets/images/gal.png');
const delPng = require('../../assets/images/del.png');

export interface CardProps {
  card: Card,
  style: React.CSSProperties,
  x: number,
  y: number,
  moveCard: (dragCard: Card, dragId: number, dragIndex: number, hoverId: number, hoverIndex: number) => void,
  deleteCard: (cardId: number) => void,

  isDragging: boolean,
  connectDragSource: ConnectDragSource,
  connectDropTarget: ConnectDropTarget
};

interface CardInstance {
  getNode(): HTMLDivElement | null
}

const CardC = React.forwardRef<HTMLDivElement, CardProps>(
  ({ card, style, deleteCard, isDragging, connectDragSource, connectDropTarget }, ref) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);

    const opacity = isDragging ? 0 : 1;
    useImperativeHandle<{}, CardInstance>(ref, () => ({
      getNode: () => elementRef.current,
    }));
    return (
      <div ref={elementRef} style={style} className="item" id={style ? card.id.toString() : null}>
        <div className="item-name">{card.title}</div>
        <div className="item-container">
          <div className="item-avatar-wrap">
            <img src={`https://randomuser.me/api/portraits/med/men/${card.id}.jpg`} alt="" />
          </div>
          <div className="item-content">
            <div className="item-author">{`${card.firstName} ${card.lastName}`}</div>
            <p>{card.txt}</p>
          </div>
        </div>
        <div className="item-perfomers">
          <div className="add-perfomers">
            <a href="#"><img src={galPng} alt="Add perfomers" /></a>
          </div>
          <div className="delete-perfomers">
            <a href="#"><img src={delPng} alt="Delete perfomers" onClick={(e) => deleteCard(card.id)} /></a>
          </div>
        </div>
      </div>
    );
  },
);

export default DropTarget(
  ItemTypes.CARD,
  {
    hover(
      props: CardProps,
      monitor: DropTargetMonitor,
      component: CardInstance,
    ) {
      if (!component) {
        return null;
      }
      const node = component.getNode();
      if (!node) {
        return null;
      }


      const dragId = monitor.getItem().id;
      const dragCard = monitor.getItem().card;
      const dragYPosition = monitor.getItem().y;
      const dragXPosition = monitor.getItem().x;

      const hoverId = props.card.id;
      const hoverCard = props.card;
      const hoverYPosition = props.y;
      const hoverXPosition = props.x;


      if (dragYPosition === hoverYPosition && dragXPosition === hoverXPosition) {
        return;
      }

      console.log("card event");
      props.moveCard(dragCard, dragId, dragYPosition, hoverId, hoverYPosition);
      monitor.getItem().x = hoverXPosition;
      monitor.getItem().y = hoverYPosition;
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
  )(CardC),
);
