@echo off
cd  api
cd  hello
setlocal
call  npm.cmd install
endlocal
cd ..\
"C:\Program Files\7-Zip\7z.exe" a  -r hello.zip -w hello -mem=AES256
cd ..
cdk deploy