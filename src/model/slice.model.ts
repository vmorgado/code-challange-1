export class Slice {
  origin_name: string;
  destination_name: string;
  duration: number;
  flight_number: number;
  departure_date_time_utc: string;
  arrival_date_time_utc: string;

  individual_price?: number;
  internal_identifier?: string;
}
