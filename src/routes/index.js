const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/blog_menu.html', function(req, res, next) {
    res.render('blog_menu',{theme:[
                            {name:1,sub:["a","b"]},
                            {name:2,sub:["a","b"]},
                            {name:3,sub:["a","b"]},
                            {name:3,sub:[]}
                            ]});

});
router.get('/', function(req, res, next) {
    let themeService = req.getDubboService("ThemeService");
    let userService = req.getDubboService("UserService");
    userService.findUserByid(13).then(data=>{
        themeService.thenmePage(1,100).then(theme=>{
            res.render('index',{themes:theme.data,describe:data.data.repotDes,createTime:data.data.updateTime});
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));


});
//主题目录
router.get('/themes/:id', function(req, res, next) {
   console.log(req.params.id)
    let id =~~req.params.id
    let dubboService = req.getDubboService("MarkdownService");
    dubboService.getMarkdownPageBy(id).then(data=>{
        if (data.data.length<4){
            let length=4-data.data.length;
            for (let i=0;i<length;i++){
                data.data.push({name:'没有多余的数据了',showUrl:"javascript:void(0)"} )
            }
        }
        while ( !data.data.length%2!=0 ){
            //非偶数填充数据
            data.data.push({name:'没有多余的数据了',showUrl:"javascript:void(0)"})
        }
     res.render('blog/index',{markdowns:data.data});
    }).catch(err=>console.log(err))


});
module.exports = router;