import { JSONSchema6 } from 'json-schema';

export default {
  type: 'object',
  properties: {
    projectLead: { type: 'boolean', title: 'Are you the product owner or project admin/team lead?' },
  },
  required: ['projectLead', 'projectName', 'preferredEmail', 'newToSso'],
  dependencies: {
    projectLead: {
      oneOf: [
        {
          properties: {
            projectLead: { enum: [false] },
          },
        },
        {
          properties: {
            projectLead: { enum: [true] },
            newToSso: {
              type: 'boolean',
              title: 'Have you requested an SSO integration before?',
              tooltipContent: `<p>If new to SSO, please visit <a style="color: #0000EE" href="https://github.com/bcgov/ocp-sso/wiki/Using-Your-SSO-Client" target="blank">github</a> for more information</p>`,
              hide: 2000,
            },
            projectName: { type: 'string', title: 'What Project is this integration for?', maxLength: 50 },
            preferredEmail: { type: 'string', title: 'Default Email Address', format: 'email', maxLength: 250 },
            additionalEmails: {
              type: ['array', 'null'],
              title: 'Additional Emails',
              items: { type: 'string', maxLength: 250, format: 'email' },
              additionalItems: { type: 'string', maxLength: 250, format: 'email' },
              deletableIndex: 0,
              maxItems: 2,
              addItemText: 'Add Email Address',
            },
          },
        },
      ],
    },
  },
} as JSONSchema6;
