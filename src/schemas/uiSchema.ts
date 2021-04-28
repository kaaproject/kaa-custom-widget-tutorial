const uiSchema = {
  serviceIntegration: {
    'ui:collapsed': false,
    'ui:order': ['*', 'service', 'applicationVersionName', 'defaultConfig', 'endpointId', 'dataPath'],
    service: {
      'ui:widget': 'select',
      'ui:options': {
        transformation: {
          dataset: {
            serviceInstance: {
              name: 'service_instances',
              sourceName: 'service_instances',
            },
          },
          select: {
            service_instances: {
              type: 'JSONPath',
              value: "$.[?(@.serviceName == 'ECR')].name",
            },
          },
          updates: [
            {
              attribute: 'enum',
              value: '${service_instances}',
            },
          ],
        },
      },
    },
    applicationVersionName: {
      'ui:widget': 'select',
      'ui:options': {
        transformation: {
          dataset: {
            appVersionName: {
              name: 'appVersionName',
              sourceName: 'applications',
            },
          },
          select: {
            appVersionName: {
              type: 'JSONPath',
              value: '$.[*].versions.[*].name',
            },
            appVersionDisplayName: {
              type: 'JSONPath',
              value: '$.[*].versions.[*].displayName',
            },
          },
          updates: [
            {
              attribute: 'enum',
              value: '${appVersionName}',
            },
            {
              attribute: 'enumNames',
              value: '${appVersionDisplayName}',
            },
          ],
        },
      },
    },
    endpointId: {
      'ui:options': {
        transformation: {
          dataset: {
            endpoints: {
              name: 'endpoints',
              sourceName: 'endpoints',
              params: {
                serviceName: 'EPR',
              },
              observes: [
                {
                  name: 'appVersionName',
                  valueFrom: '$.serviceIntegration.applicationVersionName',
                },
              ],
            },
          },
          select: {
            endpoints: {
              type: 'JSONPath',
              value: '$.endpoints.[*]',
            },
          },
          updates: [
            {
              attribute: 'enum',
              value: '${endpoints}',
            },
            {
              attribute: 'enumNames',
              value: '${endpoints}',
            },
          ],
        },
      },
    },
    dataPath: {
      'ui:widget': 'select',
      'ui:options': {
        creatable: true,
        transformation: {
          dataset: {
            dataPath: {
              name: 'dataPath',
              sourceName: 'config_keys',
              observes: [
                {
                  name: 'appVersionName',
                  valueFrom: '$.serviceIntegration.applicationVersionName',
                },
                {
                  name: 'defaultConfig',
                  valueFrom: '$.serviceIntegration.defaultConfig',
                },
                {
                  name: 'endpointId',
                  valueFrom: '$.serviceIntegration.endpointId',
                },
              ],
            },
          },
          select: {
            dataPath: {
              type: 'JSONPath',
              value: '$.dataPath.keys',
            },
          },
          updates: [
            {
              attribute: 'enum',
              value: '${dataPath}',
            },
          ],
        },
      },
    },
  },
  postfix: {
    'ui:placeholder': "℃, 'kPa' or any other string that will be displayed after the data value",
    'ui:widget': 'InputField',
  },
};

export default uiSchema;
