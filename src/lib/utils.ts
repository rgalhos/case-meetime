import { ICycleEvent, IEvent } from '../api/mock/mock.model';

export const sumEvents = (events: IEvent | ICycleEvent) => {
  return events.calls + events.emails + events.follows + events.meetings;
};
