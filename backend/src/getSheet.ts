import {google, sheets_v4} from 'googleapis';
const sheets = google.sheets('v4');

const auth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../service-key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const authClient = await auth.getClient();
  google.options({auth: authClient});
};

class DataBlock {
  [key: string]: string;
  constructor(properties: string[], values: string[]) {
    properties.forEach((property, index) => {
      this[property] = values[index];
    });
  }
}

const spreadsheetId = '1oF4Abo1kJmjGhtFhJy_DbR44XfEVsCLqcc53jeTDy8U';

const getMetaData = async() => {
  //getting meta data — the ranges of the sheets
  //update: this actually makes everything slower
  //but maybe this is better practice?

  const metaData = (await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'metaData',
  })).data.values;

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



const getSheet = async (ranges: DataBlock[]) => {  
  const sheet = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: spreadsheetId,
    ranges: ranges.map(range => `${range.sheetName}!${range.range}`),
  });
  return sheet.data.valueRanges || [];
};


const run = async () => {
  await auth();
  const metaData = await getMetaData();
  const rawData = await getSheet(metaData);


  const data: {[key: string]: DataBlock[]} = {};

  //format the raw data
  rawData.forEach(async(sheet) => {
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
  return data;
};
// const startTime = new Date();

run().then((res) => {
  console.log(res);
  // console.log(new Date() - startTime);
}).catch(console.log);
