function refreshCaptcha() {
	var time = new Date();
	document.getElementById('captcha_img').src='/captcha?t='+time.getTime()+Math.random();
}
