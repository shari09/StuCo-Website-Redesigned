export interface Event {
  name: string;
  description: string;
  date: string;
  photoUrl: string;
  buttonLink: string;
  buttonText: string;
}

export interface Member {
  name: string;
  position: string;
  quote: string;
  photoUrl: string;
}


export interface Recent {
  photoUrl: string;
  description: string;
}

export interface UpcomingMiniEvents {
  name: string;
  description: string;
}


export interface Club {
  category: string;
  name: string;
  description: string;
  photoUrl: string;
  meetingFrequency: string;
  meetingDay: string;
  meetingLocation: string;
  instagram: string;
  email: string;
}

export interface FAQ {
  question: string;
  answer: string;
}