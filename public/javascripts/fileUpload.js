const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--material-thumbnail-width-large') != null && rootStyles.getPropertyValue('--material-thumbnail-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 1 / thumbnailAspectRatio,
    imageResizeTargetWidth: thumbnailWidth,
    imageResizeTargetHeight: thumbnailHeight
})

FilePond.parse(document.body);