function ResizeHandler() {
	let e = $('.flowtime'),
		i = $('.undersize-indicator');
	640 > $(window).width() ? (e.hide(), i.show()) : (e.show(), i.hide());
}
ResizeHandler(), (window.onresize = ResizeHandler);
