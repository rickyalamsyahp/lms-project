export const tableNames = {
  USER: 'user',
  SCOPE: 'scope',
}

export const jsonProperties = {
  uuid: {
    type: 'string',
    pattern: '^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$',
    minLength: 32,
    maxLength: 36,
  },
  localeDate: {
    pattern: '^[0-9]{4}-?[0-9]{2}-?[0-9]{2}$',
    minLength: 10,
    maxLength: 10,
  },
}
