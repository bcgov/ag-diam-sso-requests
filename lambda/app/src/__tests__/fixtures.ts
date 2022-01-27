export const formDataUpdated: any = {
  id: 1,
  idirUserid: 'TEST',
  projectName: 'test',
  clientName: 'test',
  realm: 'onestopauth',
  publicAccess: true,
  devValidRedirectUris: ['https://b'],
  testValidRedirectUris: ['https://a'],
  prodValidRedirectUris: ['https://a'],
  environments: ['dev', 'test', 'prod'],
  prNumber: 10,
  actionNumber: 10,
  createdAt: 'test',
  updatedAt: '10-11-2012',
  projectLead: true,
  preferredEmail: 'test@test',
  newToSso: true,
  agreeWithTerms: true,
  status: 'draft',
  archived: false,
  additionalEmails: [],
  usesTeam: false,
};

export const formDataOriginal: any = {
  id: 1,
  idirUserid: 'TEST',
  projectName: 'test',
  clientName: 'test',
  realm: 'onestopauth',
  publicAccess: true,
  devValidRedirectUris: ['https://a'],
  testValidRedirectUris: ['https://a'],
  prodValidRedirectUris: ['https://a'],
  environments: ['dev', 'test', 'prod'],
  prNumber: 10,
  actionNumber: 10,
  createdAt: 'test',
  updatedAt: '11-12-2013',
  projectLead: true,
  preferredEmail: 'test@test',
  newToSso: true,
  agreeWithTerms: true,
  status: 'draft',
  archived: false,
  additionalEmails: [],
  usesTeam: false,
};

export const formDataWithMutatedNonFormFields: any = {
  id: 1,
  idirUserid: 'TEST',
  projectName: 'test',
  clientName: 'test-two',
  realm: 'onestopauth',
  publicAccess: true,
  devValidRedirectUris: ['https://a'],
  testValidRedirectUris: ['https://a'],
  prodValidRedirectUris: ['https://a'],
  environments: ['dev', 'test', 'prod'],
  prNumber: 15,
  actionNumber: 15,
  createdAt: 'test2',
  updatedAt: '11-12-2015',
  projectLead: true,
  preferredEmail: 'test@test',
  newToSso: true,
  agreeWithTerms: true,
  status: 'submitted',
  archived: true,
  additionalEmails: [],
  usesTeam: false,
};

export const formDataBceid: any = {
  ...formDataWithMutatedNonFormFields,
  realm: 'onestopauth-basic',
};
