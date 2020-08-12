function getPhotos() {
  const gallery = DriveApp.getFolderById('1xD8Wgi68bCZQFGY8tPU6EzKzRutCoLtx');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('gallery');
  sheet.clear({
    contentsOnly: true,
  });

  //writes back the properties
  const range = sheet.getRange('A1:B1');
  range.setValues([['photoName', 'photoId']]);

  let rowNum = 2;

  const files = gallery.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const range = sheet.getRange(rowNum, 1, 1, 2);
    range.setValues([[file.getName(), file.getId()]]);
    rowNum++;
  }
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
    metaDataSheet.getRange(i+1, 2).setValue(range.getA1Notation());
  }
}

function setRange(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const metaDataSheet = spreadsheet.getSheetByName('metaData');
  const metaData = metaDataSheet.getDataRange().getValues();
  for (let i = 1; i < metaData.length; i++) {
    if (metaData[i][0] !== sheetName) continue;
    const sheet = spreadsheet.getSheetByName(sheetName);
    const range = sheet.getDataRange();
    metaDataSheet.getRange(i+1, 2).setValue(range.getA1Notation());
  }
}

function onEdit(e) {
  const sheet = SpreadsheetApp.getActiveSheet().getName();
  setRange(sheet);
}