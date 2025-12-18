@echo off
echo Applying migrations...
python manage.py makemigrations courses
python manage.py makemigrations accounts
python manage.py makemigrations students
python manage.py migrate