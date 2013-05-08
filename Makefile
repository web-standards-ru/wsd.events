default:
	@echo "Usage make [COMMAND]"
	@echo "Commands available:"
	@echo "  check         check dependencies"
	@echo "  install       create environment and install package"
	@echo "  run           run application"
	@echo "  test          run tests"
	@echo "  publishpres   upload presentations to server"

publishpres:
	./install.sh publishpres

install:
	./install.sh install

check:
	./install.sh check

run:
	./install.sh run

test:
	@echo 'Run tests...'
	@env/bin/nosetests