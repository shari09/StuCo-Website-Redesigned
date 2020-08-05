import {google, sheets_v4} from 'googleapis';
const sheets = google.sheets('v4');
import * as rhhs from '../../common/interfaces';

type SheetName =
  | 'Events'
  | 'Members'
  | 'Other'
  | 'Recent'
  | 'Upcoming mini events'
  | 'Clubs'
  | 'FAQ';


const auth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../service-key.json',
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });

  const authClient = await auth.getClient();
  google.options({auth: authClient});
};

const sheetNames = [
  'Events',
  'Members',
  'Other',
  'Recent',
  'Upcoming mini events',
  'Clubs',
  'FAQ',
];

let rawSheetValues: sheets_v4.Schema$ValueRange[] = [];

const getRawValue = (sheetName: SheetName) => {
  const index = sheetNames.findIndex((name) => name === sheetName);
  // console.log(rawSheetValues, index);
  return rawSheetValues[index].values || [];
};

const getSheetValues = async (): Promise<sheets_v4.Schema$ValueRange[]> => {
  const rangeRes = await sheets.spreadsheets.values.batchGet({
    ranges: sheetNames.map((sheet) => `${sheet}!A2`),
    spreadsheetId: '1ahJQZoWroWl0eWKdRguVBGF7qxA0GZAzPncHSrCTzvA',
  });

  if (!rangeRes.data.valueRanges) {
    throw new Error('spreadsheet range not defined on sheet');
  }

  const dataRes = await sheets.spreadsheets.values.batchGet({
    ranges: rangeRes.data.valueRanges.map((range, index) => {
      if (!range.values) return '';
      const sheet = sheetNames[index];
      const rangeValue = range.values[0][0];
      return `${sheet}!${rangeValue}`;
    }),
    spreadsheetId: '1ahJQZoWroWl0eWKdRguVBGF7qxA0GZAzPncHSrCTzvA',
  });

  return dataRes.data.valueRanges || [];
};

const getEvents = (): rhhs.Event[] => {
  const events = getRawValue('Events');
  const formattedEvents: rhhs.Event[] = events.map((event) => {
    return {
      name: event[0],
      description: event[1],
      date: event[2],
      photoUrl: event[3],
      buttonLink: event[4],
      buttonText: event[5],
    };
  });

  return formattedEvents;
};

const getMembers = (): rhhs.Member[] => {
  const members = getRawValue('Members');
  const formattedMembers: rhhs.Member[] = members.map((member) => {
    return {
      name: member[0],
      position: member[1],
      quote: member[2],
      photoUrl: member[3],
    };
  });

  return formattedMembers;
};

const getRecents = (): rhhs.Recent[] => {
  const recents = getRawValue('Recent');
  const formattedRecents: rhhs.Recent[] = recents.map((recent) => {
    return {
      photoUrl: recent[0],
      description: recent[1],
    };
  });

  return formattedRecents;
};

const getUpcomingMiniEvents = (): rhhs.UpcomingMiniEvents[] => {
  const upcomingMiniEvents = getRawValue('Upcoming mini events');
  const formattedUpcomingMiniEvents = upcomingMiniEvents.map((event) => {
    return {
      name: event[0],
      description: event[1],
    };
  });

  return formattedUpcomingMiniEvents;
};

const getClubs = (): rhhs.Club[] => {
  const clubs = getRawValue('Clubs');
  const formattedClubs: rhhs.Club[] = clubs.map((club) => {
    return {
      category: club[0],
      name: club[1],
      description: club[2],
      photoUrl: club[3],
      meetingFrequency: club[4],
      meetingDay: club[5],
      meetingLocation: club[6],
      instagram: club[7],
      email: club[8],
    };
  });

  return formattedClubs;
};

const getFAQ = (): rhhs.FAQ[] => {
  const faq = getRawValue('FAQ');
  const formattedFaq: rhhs.FAQ[] = faq.map((q) => {
    return {
      question: q[0],
      answer: q[1],
    };
  });

  return formattedFaq;
};

//@ts-ignore
exports.run = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send({error: 'something blew up D;'});
  }
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Authorization');
  res.set('Access-Control-Max-Age', '3600');
  // res.set('Access-Control-Allow-Origin', 'https://rhhsstuco.ca');
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Credentials', 'true');

  await auth();
  rawSheetValues = await getSheetValues();
  const data = JSON.stringify({
    events: getEvents(),
    members: getMembers(),
    recents: getRecents(),
    upcomingMiniEvents: getUpcomingMiniEvents(),
    clubs: getClubs(),
    faq: getFAQ(),
  });

  res.status(200).end(data);
};

// run().then(res => {
//   console.log(res);
// }).catch(console.log);
