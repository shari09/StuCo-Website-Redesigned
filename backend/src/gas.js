//============================================================
//ok just skip this entire section cuz i found a much easier better and faster way
//which is enabling the advanced drive api service
//welp, i spent a while trying to figure this out so im still just gonna leave it here
//just skip to after the huge comment block (around line 110)


function byteToNum(byteArr) {
  const hexArr = byteToHex(byteArr);
  const hex = hexArr.join('');
  return parseInt(hex, 16);
}

function byteToHex(byteArr) {
  const hexArr = byteArr.map((byte) => {
    if (byte < 0) {
      byte = -((byte ^ 0xff) + 1);
    }
    return byte.toString(16).padStart(2, '0');
  });
  return hexArr;
}

function getJpgSize(hexArr) {
  let i = 0;
  let marker = '';

  while (i < hexArr.length) {
    //ff always start a marker,
    //something's really wrong if the first btye isn't ff
    if (hexArr[i] !== 'ff') {
      console.log(i);
      throw new Error('aaaaaaa');
    }

    //get the second byte of the marker, which indicates the marker type
    marker = hexArr[++i];

    //these are segments that don't have any data stored in it, thus only 2 bytes
    //01 and D1 through D9
    if (marker === '01' || (!isNaN(parseInt(marker[1])) && marker[0] === 'd')) {
      i++;
      continue;
    }

    /*
    sofn marker: https://www.w3.org/Graphics/JPEG/itu-t81.pdf pg 36
      INFORMATION TECHNOLOGY –
      DIGITAL COMPRESSION AND CODING
      OF CONTINUOUS-TONE STILL IMAGES –
      REQUIREMENTS AND GUIDELINES
    the legit pdf from https://www.iso.org/standard/18902.html 
    costs $289 cad in case if you're curious :)

    basically, sofn (start of frame, type n) segment contains information
    about the characteristics of the jpg

    the marker is followed by:
      - Lf [frame header length], two bytes
      - P [sample precision], one byte
      - Y [number of lines in the src img], two bytes, which is essentially the height
      - X [number of samples per line], two bytes, which is essentially the width 
      ... [other parameters]

    sofn marker codes: https://www.digicamsoft.com/itu/itu-t81-36.html
    apparently there are other sofn markers but these two the most common ones
    */
    if (marker === 'c0' || marker === 'c2') {
      break;
    }
    //2 bytes specifying length of the segment (length excludes marker)
    //jumps to the next seg
    i += parseInt(hexArr.slice(i + 1, i + 3).join(''), 16) + 1;
  }
  const size = {
    height: parseInt(hexArr.slice(i + 4, i + 6).join(''), 16),
    width: parseInt(hexArr.slice(i + 6, i + 8).join(''), 16),
  };
  return size;
}

function getSize(file) {
  const blob = file.getBlob();
  const bytes = blob.getBytes();
  //slicing the 'image/' off the mime type
  const format = blob.getContentType().slice(6);

  let size = {};

  //ew i have to deal with binary data >:(
  switch (format) {
    case 'png':
      size.width = byteToNum(bytes.slice(16, 20));
      size.height = byteToNum(bytes.slice(20, 24));
      break;
    case 'jpeg':
      size = getJpgSize(byteToHex(bytes));
      break;
    default:
      throw new Error('file format not supported');
  }
  Logger.log(JSON.stringify(size));
}

//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//actual useful code starts here 

function getFolderImages(folderId) {
  let nextPageToken;
  let files = [];
  while (true) {
    const res = Drive.Files.list({
      pageToken: nextPageToken,
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
    });
    files = [...files, ...res.items];
    nextPageToken = res.nextPageToken;
    if (!nextPageToken) break;
  }
  return files;
}

function getClubHighlights() {
  const files = getFolderImages('1THs3rA2l7Dc_Ao5mtwQxmvudyN2QA2-v');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('clubHighlights');
  sheet.clear({
    contentsOnly: true,
  });

  //writes back the properties
  const range = sheet.getRange('A1:B1');
  range.setValues([['photoName', 'photoId']]);

  let rowNum = 2;

  files.forEach(file => {
    const range = sheet.getRange(rowNum, 1, 1, 2);
    range.setValues([[file.originalFilename, file.id]]);
    rowNum++;
  });
  
  setRange('clubHighlights');
}


function getPhotos() {
  const files = getFolderImages('1xD8Wgi68bCZQFGY8tPU6EzKzRutCoLtx');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('gallery');
  sheet.clear({
    contentsOnly: true,
  });

  //writes back the properties
  const range = sheet.getRange('A1:E1');
  range.setValues([['photoName', 'photoId', 'width', 'height', 'orientation']]);

  let rowNum = 2;

  files.forEach(file => {
    const range = sheet.getRange(rowNum, 1, 1, 5);
    const width = file.imageMediaMetadata.width;
    const height = file.imageMediaMetadata.height;
    range.setValues([[file.originalFilename, file.id, width, height, width > height ? 'landscape' : 'portrait']]);
    rowNum++;
  });
  
  setRange('gallery');
}

function autoRange() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const metaDataSheet = spreadsheet.getSheetByName('metaData');
  const metaData = metaDataSheet.getDataRange().getValues();
  for (let i = 1; i < metaData.length; i++) {
    //first row is header thus index starts at 1, first column is sheetName
    const sheet = spreadsheet.getSheetByName(metaData[i][0]);
    const range = sheet.getDataRange();
    //spreadsheet row/column index starts at 1
    metaDataSheet.getRange(i + 1, 2).setValue(range.getA1Notation());
  }
}

//actually, GAS functions cannot read global functions, so you gotta
//put this inside whatever function you wanna use this in
function setRange(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const metaDataSheet = spreadsheet.getSheetByName('metaData');
  const metaData = metaDataSheet.getDataRange().getValues();
  for (let i = 1; i < metaData.length; i++) {
    if (metaData[i][0] !== sheetName) continue;
    const sheet = spreadsheet.getSheetByName(sheetName);
    const range = sheet.getDataRange();
    metaDataSheet.getRange(i + 1, 2).setValue(range.getA1Notation());
  }
}

function onEdit(e) {
  const sheetName = SpreadsheetApp.getActiveSheet().getName();
  setRange(sheetName);
}

//sorts the club sheet according to the first column
//first row is header
function sortClubsSheet() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  if (sheet.getName() !== 'clubs') return;
  const range = sheet.getDataRange();
  range.offset(1, 0, range.getNumRows() - 1).sort({column: 1, ascending: true});
};