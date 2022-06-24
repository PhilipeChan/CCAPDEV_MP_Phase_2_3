function hbsHelpers(hbs) {
    hbs.registerHelper('isSameAccount', function (sessName, pageName) { 
        return sessName == pageName;
    });
  
    // More helpers...
  }
  
  module.exports = hbsHelpers;