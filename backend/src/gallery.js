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
