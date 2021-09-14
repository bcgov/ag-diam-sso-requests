import { instance } from './axios';
import { orderBy } from 'lodash';
import { Event } from 'interfaces/Event';

interface EventSearchCriteria {
  requestId: string;
  eventType: string;
  order?: any;
  limit?: number;
  page?: number;
}

interface EventsResult {
  count: number;
  rows: Event[];
}

export const getEvents = async (criteria: EventSearchCriteria): Promise<[EventsResult, null] | [null, any]> => {
  try {
    const result: EventsResult = await instance.get('events').then((res) => res.data);
    return [{ count: result.count, rows: result.rows }, null];
  } catch (err: any) {
    console.error(err);
    return [null, err];
  }
};
