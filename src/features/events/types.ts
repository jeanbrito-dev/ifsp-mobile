export interface ExploreEvent {
  id: string;
  title: string;
  dateLabel: string;
  category: string;
  institution: string;
  imageUrl?: string | null;
}

export interface EventDetails extends ExploreEvent {
  description: string;
  location: string;
  startDateTime?: string | null;
  endDateTime?: string | null;
}

export interface EventComment {
  id: string;
  authorName: string;
  message: string;
  createdAtLabel: string;
  avatarUrl?: string | null;
}

export interface EventUser {
  name: string;
  avatarUrl?: string | null;
}
