import * as React from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import AutoformControls from '../../../../ui/AutoformControls';
import BottomToolbar from '../../../../ui/BottomToolbar';

import CellBottomToolbar from '../../../../ui/CellBottomToolbar';
import { CellPluginComponentProps } from '../../../types';
import {
  useCellPlugin,
  useDebouncedCellData,
  useIsEditMode,
  useIsFocused,
  useIsPreviewMode,
  useLang,
  useRemoveCell,
} from '../../hooks';
import InsertNew from '../InsertNew';
import PluginMissing from '../PluginMissing';

const DefaultProvider: React.FC = ({ children }) => <>{children}</>;
const PluginComponent: React.FC<{ nodeId: string }> = ({
  nodeId,
  children,
}) => {
  const lang = useLang();
  const isPreviewMode = useIsPreviewMode();
  const isEditMode = useIsEditMode();

  const [data, onChange] = useDebouncedCellData(nodeId);

  const plugin = useCellPlugin(nodeId);
  const focused = useIsFocused(nodeId);

  const Component = plugin?.Renderer ?? PluginMissing;
  const Provider = plugin.Provider ?? DefaultProvider;
  const remove = useRemoveCell(nodeId);

  const componentProps: CellPluginComponentProps<unknown> = {
    nodeId,
    lang,
    data,
    pluginConfig: plugin,
    focused: isEditMode && focused,
    readOnly: !isEditMode,
    onChange: onChange,
    isEditMode,
    isPreviewMode,
    remove,
  };

  let controls = null;
  if (controls?.type === 'custom') {
    const { Component } = controls;
    controls = <Component {...componentProps} />;
  }
  if (controls?.type === 'autoform') {
    controls = <AutoformControls {...componentProps} {...controls} />;
  }

  return (
    <Provider {...componentProps}>
      <>
        <Component {...componentProps}>
          {children}
          <InsertNew parentCellId={nodeId} />
        </Component>
        <BottomToolbar
          nodeId={nodeId}
          open={focused}
          dark={plugin.controls?.dark}
        >
          <div
            style={{ marginBottom: 24, maxHeight: '50vh', overflow: 'auto' }}
          >
            {controls}
          </div>
        </BottomToolbar>
      </>
    </Provider>
  );
};

export default PluginComponent;
