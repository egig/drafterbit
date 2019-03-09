const assert = require('assert');

describe('Login Form', function() {
	it('should display error when invalid user', function () {
		browser.newWindow('http://localhost:3000/login?lng=id');
		$('#email').setValue('admin@gmail.com');
		$('#password').setValue('wrongpassword');
		$('button').click();
		browser.waitForVisible('#error_text', 3000);
		assert.equal(browser.getText('#error_text'), 'Wrong email or password');
	});
});