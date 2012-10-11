publish:
	@echo 'Uploading files…'
	@rsync -az --delete --exclude '.DS_Store' --exclude 'Makefile' . wst@web-standards.ru:webstandardsdays.ru/
	@echo 'Done.'