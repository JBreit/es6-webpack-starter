'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('app', function () {


  it('should render "home" component when location hash/fragment is empty', function () {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });

  describe('view1', function () {

    beforeEach(function () {
      browser.get('index.html#!/view1');
    });


    it('should render view1 when user navigates to /view1', function () {
      expect(element.all(by.css('[ui-view] p')).first().getText()).toMatch(/partial for view 1/);
    });

  });


  describe('view2', function () {

    beforeEach(function () {
      browser.get('index.html#!/view2');
    });


    it('should render view2 when user navigates to /view2', function () {
      expect(element.all(by.css('[ui-view] p')).first().getText()).toMatch(/partial for view 2/);
    });

  });

  // describe('home', function () {
  //   beforeEach(function () {
  //     browser.get('index.html#!/');
  //   });

  //   it ('should render home component when user navigates to /', function () {
  //     expect(element.all(by.css('[ui-view] p')).first().getText()).toMatch(/Lorem impsum/);
  //   });
  // });
});
