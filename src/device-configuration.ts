import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import { ECRClient } from '@kaaiot/services';
import { WidgetConfig } from './types';


interface SetConfigurationParams {
  client: ECRClient;
  value: any;
  configuration: WidgetConfig;
  etag: string;
  deviceConfigurationValue: Record<string, any>;
}

interface GetConfigurationParams {
  client: ECRClient;
  configuration: WidgetConfig;
  etag: string;
}

const getDeviceUpdatedConfig = (deviceConfiguration, dataPath: string, value) => {
  return _set(_cloneDeep(deviceConfiguration), dataPath, value);
}

export const getDeviceCurrentSetting = (deviceConfiguration, key: string | undefined) => {
  return key ? _get(deviceConfiguration, key) : null;
}

export const extractDeviceConfig = (config): Record<string, any> | null => {
  try {
    return JSON.parse(config);
  } catch (error) {
    console.error("Error while parsing the device configuration", error);

    return null;
  }
}

export const extractEtagHeader = (headers): string => {
  return headers['etag'];
}

export const getThemeColors = (theme) => _get(theme, 'colorSchema.globals');

export const setConfiguration = ({
  client,
  value,
  configuration,
  etag,
  deviceConfigurationValue
}: SetConfigurationParams) => {
  const endpointId = _get(configuration, 'serviceIntegration.endpointId');
  const configurationDataPath = configuration.serviceIntegration && configuration.serviceIntegration.dataPath;
  const appVersionName = _get(configuration, 'serviceIntegration.applicationVersionName');
  const isDefaultAppConfiguration = _get(configuration, 'serviceIntegration.defaultConfig');

  const data = { ...getDeviceUpdatedConfig(deviceConfigurationValue, configurationDataPath, value) };

  if (isDefaultAppConfiguration) {
    return client
      .setDefaultConfiguration({
        appVersionName,
        headers: {
          'If-Match': etag,
        },
        data,
      })
  }

  return client
    .setEndpointConfiguration({
      appVersionName,
      endpointId,
      headers: {
        'If-Match': etag,
      },
      data,
    });
}

export const getConfiguration = ({
  client,
  configuration,
  etag
}: GetConfigurationParams) => {
  const endpointId = _get(configuration, 'serviceIntegration.endpointId');
  const appVersionName = _get(configuration, 'serviceIntegration.applicationVersionName');
  const isDefaultAppConfiguration = _get(configuration, 'serviceIntegration.defaultConfig');

  if (isDefaultAppConfiguration) {
    return client
      .getDefaultConfiguration({
        appVersionName,
        headers: {
          'If-None-Match': etag,
        }
      })
  }

  return client
    .getEndpointConfiguration({
      appVersionName,
      endpointId,
      headers: {
        'If-None-Match': etag,
      }
    });
}
