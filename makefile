default:
	@echo 'Uploading…'
	@rsync -azc --delete --exclude=.DS_Store dest/ web-standards.ru:/var/www/wsd.events/html/
	@echo 'Done.'
