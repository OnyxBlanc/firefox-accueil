@echo off
cd /d "%~dp0"

echo Vérification de Flask...
py -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installation de Flask...
    py -m pip install flask
)

echo Démarrage du serveur local...
start "Firefox Accueil Server" /MIN py "%~dp0server.py"

timeout /t 2 /nobreak >nul

echo Ouverture de la page d'accueil...
start "" "http://127.0.0.1:5000"

exit
