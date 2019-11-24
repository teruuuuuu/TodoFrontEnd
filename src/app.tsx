
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// import { Board } from './components/board/board';
import { Board } from './components/board/board';

import './assets/temp.styl';

interface Props {
}

export const App = (props: Props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Board />
    </DndProvider>
  );
};
