[Setup]
AppName=Dark Souls Save Manager
AppVersion=1.0.4
DefaultDirName={localappdata}\DarkSoulsSaveManager
DefaultGroupName=Dark Souls Save Manager
UninstallDisplayIcon={app}\DarkSoulsSaveManager.exe
; Compression=lzma2
SolidCompression=yes
OutputBaseFilename=DarkSoulsSaveManager
; OutputDir=userdocs:Inno Setup Examples Output

[Files]
Source: "dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
; Source: "MyProg.chm"; DestDir: "{app}"
; Source: "Readme.txt"; DestDir: "{app}"; Flags: isreadme

[Icons]
Name: "{group}\Dark Souls Save Manager"; Filename: "{app}\DarkSoulsSaveManager.exe"; AppUserModelID: "com.omgftw.dssm"

; [Icons]
; Name: {commonprograms}\{AppName}; Filename: {app}\{AppName}; AppUserModelID: "com.omgftw.dssm"