const schema: any = {
  type: 'object',
  properties: {
    serviceIntegration: {
      type: 'object',
      name: 'Data source',
      properties: {
        service: {
          type: 'string',
          name: 'ECR service instance name',
          enum: [],
        },
        applicationVersionName: {
          type: 'string',
          name: 'Application version name',
          enum: [],
          enumNames: [],
        },
        defaultConfig: {
          type: 'boolean',
          name: 'Display default device configuration',
          default: false,
        },
        dataPath: {
          type: 'string',
          name: 'Configuration field to display',
          enum: [],
        },
      },
      required: ['service', 'applicationVersionName', 'dataPath'],
      dependencies: {
        defaultConfig: {
          oneOf: [
            {
              properties: {
                defaultConfig: {
                  enum: [false],
                },
                endpointId: {
                  type: 'string',
                  title: 'Endpoint ID',
                  description: 'Endpoint ID to get data from. For entity related dashboard use "From dashboard context" to get endpoint id based on the route.',
                  default: '${dashboard.id}',
                  enum: ['${dashboard.id}'],
                  enumNames: ['From dashboard context'],
                },
              },
            },
          ],
        },
      },
    },
    postfix: {
      type: 'string',
      name: 'Value postfix',
    },
  },
};

export default schema;

