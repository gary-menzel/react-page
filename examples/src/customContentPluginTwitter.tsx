import { createContentPlugin } from '@react-page/create-plugin-materialui';
import React from 'react';
import { Timeline } from 'react-twitter-widgets';
export default createContentPlugin<{
  screenName: string;
}>({
  Renderer: ({ data }) => (
    <Timeline
      dataSource={{
        sourceType: 'profile',
        screenName: data.screenName,
      }}
      options={{
        height: '400',
      }}
    />
  ),
  id: 'twitter-timeline',
  title: 'Twitter timeline',
  description: 'A twitter timeline',
  version: 1,
  schema: {
    properties: {
      screenName: {
        type: 'string',
        default: 'AlYankovic',
      },
    },
    required: ['screenName'],
  },
});
