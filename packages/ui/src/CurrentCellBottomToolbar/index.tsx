import {
  useCellData,
  useCellPlugin,
  useFocusedNodeId,
  useNodeProps,
  useUpdateCellData,
} from '@react-page/core';
import React, { memo } from 'react';
import BottomToolbar from '../BottomToolbar';

const Controls: React.FC<{
  nodeId: string;
}> = ({ nodeId }) => {
  const updateCellData = useUpdateCellData(nodeId);
  const cellData = useCellData(nodeId);
  const plugin = useCellPlugin(nodeId);

  const controls = plugin.controls;

  if (controls.type === 'custom') {
    const { Component } = controls;
    return (
      <Component
        pluginConfig={plugin}
        onChange={updateCellData}
        data={cellData}
        nodeId={nodeId}
      />
    );
  }
  if (controls.type === 'autoform') {
    return (
      <AutoformControls
        onChange={updateCellData}
        data={cellData}
        nodeId={nodeId}
      />
    );
  }

  return null;
};
const CurrentCellBottomToolbar: React.FC = () => {
  const nodeId = useFocusedNodeId();

  return (
    <BottomToolbar nodeId={nodeId} open={Boolean(nodeId)} dark={false}>
      <Controls nodeId={nodeId} />
    </BottomToolbar>
  );
};

export default memo(CurrentCellBottomToolbar);
