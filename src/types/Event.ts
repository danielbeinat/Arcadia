export interface UniversityEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  category: "academic" | "cultural" | "sports" | "administrative" | "social";
  type:
    | "lecture"
    | "workshop"
    | "meeting"
    | "competition"
    | "celebration"
    | "deadline";
  organizer: string;
  capacity?: number;
  registeredCount?: number;
  imageUrl?: string;
  tags: string[];
  isRequired?: boolean;
  registrationDeadline?: Date;
  reminderTimes?: number[]; // minutes before event
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date;
  status: "confirmed" | "waitlist" | "cancelled";
  reminderSent: boolean[];
}

export interface EventReminder {
  id: string;
  eventId: string;
  userId: string;
  reminderTime: Date;
  message: string;
  sent: boolean;
  type: "notification" | "email" | "sms";
}
