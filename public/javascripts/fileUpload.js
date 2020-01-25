
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginFileRename
)

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 150,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 150,

    fileRenameFunction: file => new Promise(resolve => {
        resolve(window.prompt('Image_Name', file.name))
    }),
    
    // fileRenameFunction: (file) => {
    //     return `Image Name${file.extension}`
    // }
})

FilePond.parse(document.body);