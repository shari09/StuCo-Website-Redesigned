import {google, sheets_v4} from 'googleapis';
const drive = google.drive('v3');
const sheets = google.sheets('v4');

const auth = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../service-key.json',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const authClient = await auth.getClient();
  google.options({auth: authClient});
};


const getImages = async() => {
  const galleryFolderId = '1xD8Wgi68bCZQFGY8tPU6EzKzRutCoLtx';
  const folderRes = await drive.files.list({
    q:
      `'${galleryFolderId}' in parents` +
      " and mimeType contains 'image/'",
  });
  if (!folderRes.data.files) {
    console.log('no files found');
    return [];
  }
  const files = folderRes.data.files.map((file) => {
    const data: sheets_v4.Schema$RowData = {
      values: [
        {userEnteredValue: {stringValue: file.name}},
        {userEnteredValue: {stringValue: file.id}},
      ],
    };
    return data;
  });
  return files;
};

//writes to spreadsheet range
const writeToSheet = async(images: sheets_v4.Schema$RowData[]) => {
  //I hope no one switches up the order on the spreadsheet
  const gallerySheetId = 1825812022;
  const request: sheets_v4.Schema$UpdateCellsRequest = {
    rows: images,
    start: {
      sheetId: gallerySheetId,
      rowIndex: 4,
      columnIndex: 0,
    },
    fields: '*',
  };


  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: '1ahJQZoWroWl0eWKdRguVBGF7qxA0GZAzPncHSrCTzvA',
      requestBody: {
        requests: [{
          updateCells: request
        }],
      }
  });
};

const run = async () => {
  await auth();
  const images = await getImages();
  await writeToSheet(images);

};

run().catch(console.log);
