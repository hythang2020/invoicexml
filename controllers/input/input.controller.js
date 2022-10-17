// var db = require('../../../model/database');
var multer  = require('multer');
var moment = require('moment');
var path = require('path');
var Middleware= require('../../middleware/middleware');
const db = require('../../model/database');
var fs = require('fs'),
    xml2js = require("xml2js");
const fileUpload = require('express-fileupload');
//GET FROM INPUT

module.exports.index =function (req, res) {
    
    var sql = 'SELECT * FROM tb_hoadon as hd INNER JOIN tb_uploads as up ON up.id = hd.id_upload order by hd.id desc';
    db.query(sql,function(err,data,fields){
        if (err) throw err;
        res.render('input/input-index',{
            hoadon:data,
            
            title: "Xem hóa đơn",
        });
    });
};

//GET UPLOAD FORM HÓA ĐƠN

module.exports.uploadxml =  function(req, res) {
    var message = '';
        res.render('input/input-upload',{
            message:message,
            title: "Form upload hóa đơn",
            });
};

//END GET UPLOAD HÓA ĐƠN
//POST UPLOAD FORM HÓA ĐƠN

module.exports.postuploadxml =  function(req, res) {
    var xmlName = req.files.inputxml.name;
    var xmlfilename = req.files.inputxml;
    const extensionNamexml = path.extname(xmlfilename.name);
    const allowedExtension = ['.xml'];
    if(!allowedExtension.includes(extensionNamexml)){
        return res.status(422).render('input/input-upload',{
            message:"File "+xmlName+" không đúng định dạng ! vui lòng upload file XML",
            title: "Form upload hóa đơn",

            });
    }
    var xmluploadfile = req.files.inputxml.data.toString('utf-8');
    
    //Khai báo, lấy file pdf
    var pdfName = req.files.inputpdf.name;
    var pdffilename = req.files.inputpdf;
    const extensionNamepdf = path.extname(pdffilename.name);
    const allowedExtensionpdf = ['.pdf'];
    if(!allowedExtensionpdf.includes(extensionNamepdf)){
        return res.status(422).render('input/input-upload',{
            message:"File "+pdfName+" không đúng định dạng ! vui lòng upload file PDF",
            title: "Form upload hóa đơn",

            });
    }
    var xml = new xml2js.Parser();
    
    xml.parseString(xmluploadfile, function (err, result) {
    if(err){
            console.log(err.message);
        }else{
            var end = (result['HDon'])['DLHDon'];
            for (var i = 0; i< end.length; i++){
                var hd = end[i];
                // console.log(hd.TTChung[0].SHDon.toString());
                // console.log(hd.NDHDon[0].NBan[0].MST.toString());
            }
        }

    //Xử lý lấy từ thẻ HOA DON
    var s = xmluploadfile.search('<HDon>');
    var s1 = xmluploadfile.slice(s);

    var sql = "INSERT INTO tb_uploads(url_xml,url_pdf,tb_xmldetail,createdate) VALUES ('"+xmlName+"','"+pdfName+"','"+s1+"',NOW())"
    db.query(sql,function(error,rs,fields){
        if(error) throw error;
        //phan loai hoa don -- luu hoa đơn
        var SHDon = hd.TTChung[0].SHDon.toString();
        var N_ban = hd.NDHDon[0].NBan[0].Ten.toString();
        var N_mua = hd.NDHDon[0].NMua[0].Ten.toString();
        var n_lap = hd.TTChung[0].NLap.toString();

        if(hd.NDHDon[0].NBan[0].MST.toString() !== '0305113833'){
            var phanloaihd = 1 ;
            var uploadPathfiexml = './invoice-xml/input/'+ xmlfilename.name;
            var uploadPathfilepdf = './invoice-xml/input/'+ pdffilename.name;
                xmlfilename.mv(uploadPathfiexml, function(err) {
                    if (err) return res.status(500).send(err);
                    pdffilename.mv(uploadPathfilepdf, function(err) {
                        if (err) return res.status(500).send(err);
                        var tthoadon = "INSERT INTO tb_hoadon(masohd,phanloaihd,ten_n_ban,ten_n_mua,ngay_lap,id_upload,createdate) VALUES ('"+SHDon+"','"+phanloaihd+"','"+N_ban+"','"+N_mua+"','"+n_lap+"','"+rs.insertId+"',NOW())"
                        db.query(tthoadon,function(error,rs,fields){
                            if(error) throw error;
                                res.redirect('/input-invoice/');
                    
                    });
                })
            })
        }else{
            var phanloaihd = 2;
                var uploadPathfiexml ='./invoice-xml/output/'+ xmlfilename.name;
                var uploadPathfilepdf = './invoice-xml/output/'+ pdffilename.name;
                xmlfilename.mv(uploadPathfiexml, function(err) {
                    if (err) return res.status(500).send(err);
                    pdffilename.mv(uploadPathfilepdf, function(err) {
                        if (err) return res.status(500).send(err);
                        var tthoadon = "INSERT INTO tb_hoadon(masohd,phanloaihd,ten_n_ban,ten_n_mua,ngay_lap,id_upload,createdate) VALUES ('"+SHDon+"','"+phanloaihd+"','"+N_ban+"','"+N_mua+"','"+n_lap+"','"+rs.insertId+"',NOW())"
                        db.query(tthoadon,function(error,rs,fields){
                            if(error) throw error;
                                res.redirect('/input-invoice/');
                        })
                })
            })
            }
        })
})
}
//END POST UPLOAD HÓA ĐƠN


//GET PDF INVOICE

module.exports.pdf =  function(req, res) {
    var phanloai = req.params.plhd;
    if (phanloai === 1){
        res.sendFile(path.join(__dirname, "../../invoice-xml/input/" + req.params.pdf));
    }else{
        res.sendFile(path.join(__dirname, "../../invoice-xml/output/" + req.params.pdf));
    }
};


// API GET BY ID

module.exports.apigethd =  function(req, res) {
    var sql = "SELECT up.tb_xmldetail FROM tb_hoadon as hd inner join tb_uploads as up on hd.id_upload = up.id WHERE up.id = ? ";
    // db.query(sql,[req.body.id_upload], (err, result) => {
    db.query(sql,[req.params.id], (err, result) => {
        if (err) throw err
        res.status(200).json({
            xml_info:result[0]
        }
        )
        // console.log(result[0].tb_xmldetail)
    })
}


//END API GET BY ID