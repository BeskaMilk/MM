let OSS = require('ali-oss');
let store = new OSS({
    bucket: 'material-image-list',
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4FcLp7H4hkBF6RamDeJU',
    accessKeySecret: 'LC27jB4IfOfrsBwkxw2bo5iv07ugkY'
})


g_dirname = ''
g_object_name = ''
g_object_name_type = ''
now = timestamp = Date.parse(new Date()) / 1000; 

const url = store.signatureUrl('ossdemo.png', {
  process: 'image/resize,w_200'
});
console.log(url);
// --------------------------------------------------
const url = store.signatureUrl('ossdemo.png', {
  expires: 3600,
  process: 'image/resize,w_200'
});
console.log(url);