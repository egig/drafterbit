const assert = require('assert');

describe('webdriver.io page', function() {
	it('should have the right title - the fancy generator way', function () {
		browser.newWindow('http://localhost:3000/login?lng=id');
		$('#email').setValue('admin@gmail.com');
		$('#password').setValue('admin123');
		$('button').click();
		let title = browser.getTitle();
		assert.equal(title, 'Login - Drafterbit');
	});
});