import {google} from 'googleapis';
const sheets = google.sheets('v4');

const spreadsheetId = '1oF4Abo1kJmjGhtFhJy_DbR44XfEVsCLqcc53jeTDy8U';

const auth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../service-key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const authClient = await auth.getClient();
  google.options({auth: authClient});
};

//=====================================================================

class DataBlock {
  [key: string]: string;
  constructor(properties: string[], values: string[]) {
    properties.forEach((property, index) => {
      this[property] = values[index];
    });
  }
}

//=====================================================================

const getMetaData = async () => {
  //getting meta data — the ranges of the sheets
  //update: this actually makes everything slower by a few hundred ms
  //but maybe this is better practice?

  const metaData = (
    await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'metaData',
    })
  ).data.values;

  if (!metaData) {
    throw new Error('meta data not found on spreadsheet');
  }

  const metaDataProperties = metaData[0];

  const ranges = [];
  for (let i = 1; i < metaData.length; i++) {
    ranges.push(new DataBlock(metaDataProperties, metaData[i]));
  }
  return ranges;
};

//=====================================================================

const getSheet = async (ranges: DataBlock[]) => {
  const sheet = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: spreadsheetId,
    ranges: ranges.map((range) => `${range.sheetName}!${range.range}`),
  });
  return sheet.data.valueRanges || [];
};

//=====================================================================

//@ts-ignore
exports.run = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send({error: 'something blew up D;'});
  }
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Authorization');
  res.set('Access-Control-Max-Age', '3600');
  // res.set('Access-Control-Allow-Origin', 'https://rhhsstuco.ca');
  // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  // I'm sure this is fine and safe and definitely secure
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', 'true');

  await auth();

  const metaData = await getMetaData();
  const rawData = await getSheet(metaData);

  const data: {[key: string]: DataBlock[]} = {};

  //format the raw data
  rawData.forEach(async (sheet) => {
    if (!sheet.values || !sheet.range) {
      return;
    }
    const sheetNameMatch = /(.+?)!/.exec(sheet.range);
    if (!sheetNameMatch) return;

    const sheetName = sheetNameMatch[1];
    data[sheetName] = [];

    const properties = sheet.values[0];
    for (let i = 1; i < sheet.values.length; i++) {
      data[sheetName].push(new DataBlock(properties, sheet.values[i]));
    }
  });

  res.status(200).end(JSON.stringify(data));
};
