export type { BackendFactory as DndBackend } from 'dnd-core';
export { DropTarget, DragSource } from 'react-dnd';
import { Actions } from './actions';
import Editable from './components/Editable';
import EditorStore, {
  createEmptyState,
  CoreEditorProps,
  Languages,
} from './EditorStore';

import lazyLoad from './helper/lazyLoad';
import Provider from './Provider';
import { reducer } from './reducer';

import { connect, ReduxContext, ReduxProvider } from './reduxConnect';
import { Selectors } from './selector';

export * from './types';
export * from './components/hooks';

import { setAllSizesAndOptimize } from './reducer/editable/helper/setAllSizesAndOptimize';
import { DisplayModes } from './actions/display';
import deepEquals from './utils/deepEquals';
import { Migration } from './migrations/Migration';

const Editor = EditorStore;
export {
  deepEquals,
  setAllSizesAndOptimize,
  Migration,
  createEmptyState,
  CoreEditorProps,
  /**
   * @deprecated
   */
  Actions,
  Selectors,
  /**
   * @deprecated Editor was renamed to EditorStore
   */
  Editor,
  EditorStore,
  reducer,
  ReduxProvider,
  connect,
  ReduxContext,
  Languages,
  DisplayModes,
};
// newer api
export { Provider, Editable, lazyLoad };

export default Editor;
