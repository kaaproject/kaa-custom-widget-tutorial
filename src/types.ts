export interface WidgetConfig {
  header: any;
  serviceIntegration?: {
    service: string;
    applicationVersionName: string;
    defaultConfig: boolean;
    dataPath: string;
    endpointId: string;
  },
  postfix: string;
}
