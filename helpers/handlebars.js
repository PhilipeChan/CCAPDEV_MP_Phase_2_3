function hbsHelpers(hbs) {
    hbs.registerHelper('isSameAccount', function (sessName, pageName) { 
        return sessName == pageName;
    });
  
    hbs.registerHelper('containsPost', function (search, author, title, body) {
        var flag = author.includes(search) || title.includes(search) || body.includes(search);
        return flag;
    });
  }
  
  module.exports = hbsHelpers;