import { models } from '@lambda-shared/sequelize/models/models';

export const createEvent = async (data: any) => {
  try {
    await models.event.create(data);
  } catch (err) {
    console.error(err);
  }
};