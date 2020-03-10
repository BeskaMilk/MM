
// We want to preview images, so we register
// the Image Preview plugin, We also register 
// exif orientation (to correct mobile image
// orientation) and size validation, to prevent
// large files from being added
FilePond.registerPlugin(
  FilePondPluginImagePreview,

);



FilePond.setOptions({
    stylePanelAspectRatio: 150 / 150,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 150,
})

// // Select the file input and use 
// // create() to turn it into a pond
// FilePond.create(
//   document.querySelector('input'),

//   // Use Doka.js as image editor
//   imageEditEditor: Doka.create({
//     utils: ['crop', 'filter', 'color']
//   })
// );

FilePond.parse(document.body);