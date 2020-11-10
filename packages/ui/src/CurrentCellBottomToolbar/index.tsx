import {
  useCellData,
  useCellPlugin,
  useFocusedNodeId,
  useIsEditMode,
  useIsPreviewMode,
  useRemoveCell,
  useUpdateCellData,
} from '@react-page/core';
import React, { memo } from 'react';
import AutoformControls from '../AutoformControls';
import BottomToolbar from '../BottomToolbar';

const Controls: React.FC<{
  nodeId: string;
}> = ({ nodeId }) => {
  const updateCellData = useUpdateCellData(nodeId);
  const cellData = useCellData(nodeId);
  const plugin = useCellPlugin(nodeId);
  const remove = useRemoveCell(nodeId);

  const isEditMode = useIsEditMode();

  const isPreviewMode = useIsPreviewMode();
  const controls = plugin.controls;

  const props = {
    focused: true, // TODO: remove focused
    readOnly: !isEditMode,
    isEditMode: isEditMode,
    isPreviewMode: isPreviewMode,
    pluginConfig: plugin,
    onChange: updateCellData,
    data: cellData,
    nodeId: nodeId,
    remove: remove,
  };

  if (controls?.type === 'custom') {
    const { Component } = controls;
    return <Component {...props} />;
  }
  if (controls?.type === 'autoform') {
    return <AutoformControls {...props} {...controls} />;
  }

  return null;
};
const CurrentCellBottomToolbar: React.FC = () => {
  const nodeId = useFocusedNodeId();

  return (
    <BottomToolbar nodeId={nodeId} open={Boolean(nodeId)} dark={false}>
      <div style={{ marginBottom: 24, maxHeight: '50vh', overflow: 'auto' }}>
        <Controls nodeId={nodeId} />
      </div>
    </BottomToolbar>
  );
};

export default memo(CurrentCellBottomToolbar);
