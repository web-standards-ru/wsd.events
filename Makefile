default:
	@if [ "`whoami`" == 'root' ]; then \
		echo 'I am root'; \
		easy_install pip virtualenv; \
	else \
		echo "Usage: make [COMMANDS]"; \
		echo "Commands available:"; \
		echo "  check: check dependencies for install"; \
		echo "  install: create environment and install package"; \
		echo "  run: run application on 127.0.0.1:5000"; \
		echo "  publishpres: upload presentations to server"; \
	fi

publishpres:
	@echo 'Uploading presentations...'
	@if [ "`cat .git/HEAD`" == 'ref: refs/heads/master' ]; then \
		echo 'Upload to production'; \
		rsync -az --delete --exclude '.DS_Store' ./pres webstandardsdays.ru:/var/www/webstandardsdays.ru/master/; \
	else \
		echo 'Upload to dev'; \
		rsync -az --delete --exclude '.DS_Store' ./pres dev.webstandardsdays.ru:/var/www/webstandardsdays.ru/dev/; \
	fi
	@echo 'Done.'

install: check
	@echo "Create environment..."
	@virtualenv --prompt=\[wsd\] ./env
	@echo "Installing packages..."
	@env/bin/pip install -r pip-requirements

check: virtualenv-exists pip-exists
	@echo 'Dependency checked complete'

virtualenv-exists:
	@echo 'Check for virtualenv'
	@if which virtualenv > /dev/null; then \
		echo '  Virtualenv exist'; \
	else \
		echo '  virtualenv doesnt exist'; \
		echo '  Please run "sudo make && make install"'; \
		exit 1; \
	fi

pip-exists:
	@echo 'Check for pip'
	@if which pip > /dev/null; then \
		echo '  pip exist'; \
	else \
		echo '  pip doesnt exist'; \
		echo '  Please run "sudo make && make install"'; \
		exit 1; \
	fi

run:
	@echo "Run application"
	@env/bin/python app.py