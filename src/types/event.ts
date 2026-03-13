export interface Event {
  id?: string | number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  event_date?: string; // mapping fallback for display
  location: string;
  banner_url?: string;
  image_url?: string; // mapping fallback for display
  code?: string;
  registered_count?: number;
  attended_count?: number;
  _count?: {
    registrations: number;
    check_ins: number;
  };
}
