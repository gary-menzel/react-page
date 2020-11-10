import { CellPlugin, lazyLoad } from '@react-page/editor';
import * as React from 'react';
import { AnyAction } from 'redux';
import { ActionTypes } from 'redux-undo';
import SlateEditor from './components/SlateEditor';
import SlateProvider from './components/SlateProvider';
import { defaultTranslations } from './default/settings';
import HtmlToSlate from './HtmlToSlate';
import v002 from './migrations/v002';
import v003 from './migrations/v003';
import v004 from './migrations/v004';
import * as pluginFactories from './pluginFactories/index';
import * as defaultPlugins from './plugins/index';
import { InitialSlateStateDef } from './types/initialSlateState';
import { SlatePluginCollection } from './types/SlatePlugin';
import { SlateState } from './types/state';
import makeSlatePluginsFromDef from './utils/makeSlatePluginsFromDef';
import transformInitialSlateState from './utils/transformInitialSlateState';

const slatePlugins = defaultPlugins;
export { defaultPlugins, slatePlugins, pluginFactories, HtmlToSlate };
const Subject = lazyLoad(() => import('@material-ui/icons/Subject'));
const Controls = lazyLoad(() => import('./components/Controls'));

const migrations = [v002, v003, v004];
type SlateDefinition<TPlugins extends SlatePluginCollection> = {
  icon: JSX.Element;
  plugins: TPlugins;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultPluginType: string;

  id: string;
  version: number;
  translations: typeof defaultTranslations;
  migrations: typeof migrations;
  allowInlineNeighbours: boolean;
  hideInMenu?: boolean;
};
type DefaultPlugins = typeof defaultPlugins;
type DefaultSlateDefinition = SlateDefinition<DefaultPlugins>;
export type CreateDataCustomizer<TPlugins> = ({
  plugins,
}: {
  plugins: TPlugins;
}) => InitialSlateStateDef;

const defaultConfig: DefaultSlateDefinition = {
  icon: <Subject />,
  plugins: defaultPlugins,
  defaultPluginType: 'PARAGRAPH/PARAGRAPH',

  id: 'ory/editor/core/content/slate',
  version: 1,
  translations: defaultTranslations,
  migrations,

  allowInlineNeighbours: true,
};

type CreateSlateData<TPlugins> = (
  custom?: CreateDataCustomizer<TPlugins>
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
SlateState;
export type SlatePlugin<TPlugins> = CellPlugin<
  SlateState,
  Omit<SlateState, 'selection'> & {
    importFromHtml?: string;
  }
> & {
  createData: CreateSlateData<TPlugins>;
  createDataFromHtml: (html: string) => SlateState;
  /**
   * @deprecated, use createData
   */
  createInitialSlateState: CreateSlateData<TPlugins>;
};
export type SlateCustomizeFunction<TPlugins extends SlatePluginCollection> = (
  def: DefaultSlateDefinition
) => SlateDefinition<TPlugins>;

function plugin<TPlugins extends SlatePluginCollection = DefaultPlugins>(
  customize?: SlateCustomizeFunction<TPlugins>
): SlatePlugin<TPlugins> {
  const settings = (customize
    ? customize(defaultConfig)
    : defaultConfig) as SlateDefinition<TPlugins>;

  const createData = (customizer: CreateDataCustomizer<TPlugins>) => {
    return transformInitialSlateState(
      customizer({ plugins: settings.plugins })
    );
  };

  const createInitialData = () =>
    createData(({ plugins }) => ({
      children: [
        {
          plugin: plugins.paragraphs.paragraph,
          children: [''],
        },
      ],
    }));

  // plugins should be flatten
  // NEW: to make it easier to manage and group plugins,
  // they now need to be an object of object with group and keys, see type SlatePluginCollection
  const plugins = makeSlatePluginsFromDef(settings.plugins);
  const htmlToSlate = HtmlToSlate({ plugins });

  return {
    Provider: (props) => (
      <SlateProvider
        {...props}
        plugins={plugins}
        translations={settings.translations}
        defaultPluginType={settings.defaultPluginType}
      />
    ),
    Renderer: (props) => (
      <SlateEditor
        {...props}
        plugins={plugins}
        translations={settings.translations}
        defaultPluginType={settings.defaultPluginType}
      />
    ),
    controls: {
      type: 'custom',
      dark: true,
      Component: (props) => (
        <Controls
          {...props}
          plugins={plugins}
          translations={settings.translations}
        />
      ),
    },

    id: settings.id || (settings as any).name,
    version: settings.version,
    IconComponent: settings.icon,
    title: settings.translations.pluginName,
    description: settings.translations.pluginDescription,
    hideInMenu: settings.hideInMenu,
    allowInlineNeighbours: settings.allowInlineNeighbours,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reducer: (state: any, action: AnyAction) => {
      if (
        (action.type === ActionTypes.UNDO ||
          action.type === ActionTypes.REDO) &&
        (state?.content?.state?.slate ?? false)
      ) {
        return {
          ...state,
          content: {
            ...state.content,
            state: {
              ...state.content.state,
            },
          },
        };
      }
      return state;
    },
    // disable default hotkeys
    handleRemoveHotKey: () => Promise.reject(),
    handleFocusPreviousHotKey: () => Promise.reject(),
    handleFocusNextHotKey: (e, node) => Promise.reject(),

    createInitialData,
    createInitialState: createInitialData,
    createInitialSlateState: createData,
    createData: createData,
    createDataFromHtml: htmlToSlate,
    // remove selection
    serialize: (s) => (s ? { slate: s.slate } : null),
    unserialize: (s) => {
      if (s?.importFromHtml) {
        return htmlToSlate(s.importFromHtml);
      }
      if (s?.slate) {
        return {
          slate: s.slate,
        };
      }
      return createInitialData();
    },

    // TODO this is disabled because of #207
    // merge = hooks.merge
    // split = hooks.split

    migrations: settings.migrations,
  };
}

export default plugin;
