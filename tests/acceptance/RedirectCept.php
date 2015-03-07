<?php
	$I = new AcceptanceTester($scenario);
	$I->wantTo('ensure that admin redirect works');
	$I->amOnPage('/admin'); 
	$I->dontSee('shortcuts');
?>