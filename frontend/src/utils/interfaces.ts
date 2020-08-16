export interface Event {
  name: string;
  description: string;
  photoId: string;
  photoUrl: string;
  buttonLink: string;
  buttonText: string;
}

export interface CountDown {
  eventName: string;
  date: string;
}

export interface Member {
  name: string;
  position: string;
  quote: string;
  photoId: string;
}


export interface Recent {
  photoId: string;
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
  photoId: string;
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

export interface Photo {
  photoName: string;
  photoId: string;
}

export interface AboutStuco {
  stucoTagline: string;
  stucoDescription: string;
}