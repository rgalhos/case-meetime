import { ICycle, ICycleEvent, IEvent } from '../api/mock/mock.model';

export const sumEvents = (events: IEvent | ICycleEvent) => {
  return events.calls + events.emails + events.follows + events.meetings;
};

export const getWeekday = () => {
  return new Date().getDay();
};

export const countEventsForToday = (cycle: ICycle) => {
  const today = getWeekday();
  const events = cycle.structure.find((c) => c.day === today);
  return !!events ? sumEvents(events) : 0;
};
