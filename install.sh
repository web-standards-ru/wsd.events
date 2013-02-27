#!/bin/bash

ERROR="\033[0;31mERROR:\033[0m"
YESNO="\033[0;32m[y/n]\033[0m"

checkdeps () {
  echo "Checking for virtualenv..."
  if which virtualenv > /dev/null
  then
    echo "  Virtualenv exist"
  else
    echo -e "${ERROR} virtualenv doesn't exist"
    echo -e "  Install virtualenv? ${YESNO}"
    sudo easy_install virtualenv
  fi
  echo "Checking for pip..."
  if which pip > /dev/null
  then
    echo "  Pip exist"
  else
    echo -e "${ERROR} pip doesn't exist"
    echo -e "  Install pip? ${YESNO}"
    read confirm
    case ${confirm} in
      [yY])
        echo "  trying to install pip"
        sudo easy_install pip
        ;;
      [nN])
        echo "Exiting..."
        exit 1
        ;;
      *)
        echo "Exiting..."
        exit 1
        ;;
    esac
  fi
  echo "Dependency checking is complete"
}

syncpres () {
    rsync -az --delete --exclude '.DS_Store' ./pres webstandardsdays.ru:/var/www/webstandardsdays.ru/${branch_name}/
}

publish () {
  branch_name="$(git symbolic-ref HEAD 2>/dev/null)"
  branch_name=${branch_name##refs/heads/}
  case ${branch_name} in
    "master")
      echo "Upload to production..."
      syncpres
      ;;
    "dev")
      echo "Upload to dev..."
      syncpres
      ;;
    *)
      echo -e "${ERROR}"
      echo "  You're on branch ${branch_name}"
      echo "  Checkout to branch 'master' or 'dev'"
      exit 1
      ;;
  esac
}

if [ $# = 1 ]
then
  case "$1" in
    "publishpres")
      echo "Uploading presentations..."
      publish
      ;;
    "install")
      checkdeps
      echo "Creating environment..."
      virtualenv --prompt=\[wsd\] ./env
      echo "Installing packages..."
      env/bin/pip install -r pip-requirements
      echo "Done"
      ;;
    "check")
      checkdeps
      ;;
    *)
      echo -e "${ERROR} Unknown parameter \"${1}\""
      exit 1
    ;;
  esac
else
  echo -e "${ERROR} Wrong parameters number"
  exit 1
fi
