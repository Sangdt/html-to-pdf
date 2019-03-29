var express = require('express');
var router = express.Router();
var htmlPf = require('html-pdf');
const jsdom = require('jsdom');
var ejs = require('ejs');
var fs = require('fs');
const { JSDOM } = jsdom;
//var templateString = fs.readFileSync('./views/hoadon1.html', 'utf-8');

  /**
   * tạo 1 page html đầy đủ có css để tạo file pdf cho hoàn chỉnh
   * return 1 chuỗi html
   */
  const getHoadonHtml = ()=>{
    var HoadonHtml = fs.readFileSync('./views/hoadon.ejs','utf-8');
    //add thêm thông tin css để file pdf tạo ra đúng chuẩn
    var pageInfo= '<!DOCTYPE html><html><head><title>HTml to PDF</title><link rel="stylesheet" href="https://html-to-pdf-fpt.herokuapp.com/stylesheets/style.css" /><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> </head><body>';
    var pageEnd = "</body></html>";
    var html= pageInfo + ejs.render(HoadonHtml)+pageEnd;
    const htmlstring = new JSDOM(html);// tạo đối tượng html để chuẩn bị thay đổi img tag
    var img =htmlstring.window.document.getElementById("imgLOGO");// lấy thẻ img trong html 
    img.src="https://html-to-pdf-fpt.herokuapp.com/images/Untitled.png"
    const finalHTML=htmlstring.window.document.documentElement.outerHTML;// trả về chuổi html đã thay đổi
  
    return finalHTML;//return html string 
}

// Delete file pdf cũ trc khi tạo ra 1 cái mới
const deleteFile = (filePath, callback) => {
  // Unlink the file.
  fs.unlink(filePath, (error) => {
    if (!error) {
      callback(false);
    } else {
      callback('Error deleting the file');
    }
  })
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'html-pdf' });
});


/*GET PDF downLoad */
router.get('/getPDF', function(req, res, next) {
  var htmlString= getHoadonHtml();
  var downloadFile = __dirname + '/PDF contains/pdfResult.pdf';// lấy path để gửi về client 

  //Xóa file pdf cũ trc khi tạo để cập nhật khi có thay đổi 
  deleteFile(downloadFile,(error)=>{
    if(error) console.log(error);
  })

  //tạo file pdf!
  htmlPf.create(htmlString).toFile('./routes/PDF contains/pdfResult.pdf', function(err, path) {
    if (err) return console.log(err);
    console.log(path); // { filename: '/app/businesscard.pdf' }
    res.sendFile(downloadFile);//gửi về client!
  });
});
module.exports = router;
