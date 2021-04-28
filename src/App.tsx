import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { WidgetConfig } from './types';
import { createECRClient, WidgetModuleContext } from '@kaaiot/services';
import CircularSlider from '@fseehawer/react-circular-slider';
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';

import {
  getDeviceCurrentSetting, extractDeviceConfig, extractEtagHeader, getThemeColors, setConfiguration, getConfiguration
} from './device-configuration';

type Props = {
  widgetContext: WidgetModuleContext<WidgetConfig>;
};

const App: React.FC<Props> = (props) => {
  const {
    widgetContext: { widgetService },
  } = props;
  const ecrClient = useRef(createECRClient('/ecr'));
  const [loading, setLoading] = useState(true);
  const [deviceConfigurationValue, setDeviceConfigurationValue] = useState(null);
  const [etag, setEtag] = useState<string>('');

  const configuration = widgetService.getWidgetConfig();
  const configurationDataPath = configuration.serviceIntegration && configuration.serviceIntegration.dataPath;
  const themeColors = getThemeColors(widgetService.getTheme());

  const value = getDeviceCurrentSetting(deviceConfigurationValue, configurationDataPath);

  const handleChange = _debounce((value) => {
    setConfiguration({
      value,
      client: ecrClient.current,
      configuration,
      etag,
      deviceConfigurationValue
    })
      .then((response) => {
        setLoading(false);
        const deviceConfig = extractDeviceConfig(response.data.config);
        setDeviceConfigurationValue(deviceConfig);
        setEtag(extractEtagHeader(response.headers));
      })
      .catch((error) => {
        console.error("Error while updating device configuration", error);
      });
  }, 500);

  useEffect(() => {
    setLoading(true);

    getConfiguration({
      client: ecrClient.current,
      configuration,
      etag
    })
      .then((response) => {
        setLoading(false);
        const deviceConfig = extractDeviceConfig(response.data.config);
        setEtag(extractEtagHeader(response.headers));
        setDeviceConfigurationValue(deviceConfig);
      })
      .catch((error) => {
        setLoading(false);
        setDeviceConfigurationValue(null);
        console.error("Error while retrieving the device configuration", error);
      });
  }, []);

  return (
    <div className="root">
      {
        value && !loading && (
          <CircularSlider
            width={250}
            label={configuration.postfix || 'Current value'}
            labelBottom
            labelColor={themeColors.textColors.colorPrimary}
            knobColor={themeColors.textColors.colorPrimary}
            trackColor={themeColors.elementColors.colorSurface2}
            progressColorFrom={themeColors.textColors.colorSecondary}
            progressSize={16}
            trackSize={16}
            dataIndex={value}
            onChange={handleChange}
          />
        )
      }
      {
        loading && (
          <div className='spinnerWrapper' style={{ backgroundColor: themeColors.elementColors.colorSurface3 }}>
            <div className='spinner'></div>
          </div>
        )
      }
      {!value && !loading && <div className="noData">{'No data available'}</div>}
    </div>
  )
};

export default App;
