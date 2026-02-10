@echo off
echo Applying migrations...
python manage.py makemigrations product
python manage.py makemigrations shop
python manage.py makemigrations accounts
python manage.py makemigrations comment
python manage.py migrate