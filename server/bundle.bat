generate-exe.py py2exe
mkdir i2DX
move dist i2DX\server
xcopy /e /i ..\client i2DX\client
copy config.ini i2DX\server\