
g_pictureID = ''

function get_materialID()
{
    var picture_ID = document.getElementById("pictureID").value;
    if (picture_ID != '' && picture_ID.indexOf('/') != picture_ID.length - 1)
    {
        picture_ID = picture_ID + '/'
    }
    g_pictureID = picture_ID
    console.log(picture_ID)
}
