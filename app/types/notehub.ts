export interface NotehubEvent {
  uid: string;
  when: number;
  file: string;
  body: Record<string, any>;
  device: string;
  sn: string;
  best_id: string;
  transport?: string;
  product?: string;
  app?: string;
  received?: number;
  req?: string;
  fleets?: string[];
}

export interface NotehubEventsResponse {
  has_more: boolean;
  events: NotehubEvent[];
}
