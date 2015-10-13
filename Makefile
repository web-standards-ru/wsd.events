publish:
	@echo 'Uploading files…'
	@rsync -rtz -O --chmod g+rw --exclude '.DS_Store' --exclude '.git' --exclude 'Makefile' . web-standards.ru:/var/www/webstandardsdays.ru/www/htdocs/
	@echo 'Done.'
