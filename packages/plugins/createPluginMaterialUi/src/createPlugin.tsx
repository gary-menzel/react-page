import { CellPlugin } from '@react-page/editor';
import { PluginWithSchemaDefinition } from './types';

type CustomizeFunction<T, CT> = (
  def: PluginWithSchemaDefinition<T>
) => PluginWithSchemaDefinition<T & CT>;

// eslint-disable-next-line @typescript-eslint/ban-types
function createPluginWithDef<T>({
  schema,
  Renderer,
  controlsLayout,
  ...pluginSettings
}: PluginWithSchemaDefinition<T>): CellPlugin<T> {
  console.warn(
    '@react-page/create-plugin-materialui is deprecated, its functionality is now nativly supportd by react-page'
  );

  return {
    Renderer,
    controls: {
      type: 'autoform',
      columnCount: controlsLayout?.columnCount,
      schema,
    },
    ...pluginSettings,
  };
}

function createContentPlugin<T>(definition: PluginWithSchemaDefinition<T>) {
  return function <CT>(customize?: CustomizeFunction<T, CT>) {
    if (customize) {
      return createPluginWithDef<T & CT>(customize(definition));
    }
    return createPluginWithDef<T>(definition);
  };
}

export default createContentPlugin;
