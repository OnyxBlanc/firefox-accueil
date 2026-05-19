@echo off
:: Lance directement index.html dans le navigateur par defaut.
:: Plus besoin de Python ni de serveur.
start "" "%~dp0index.html"
exit
