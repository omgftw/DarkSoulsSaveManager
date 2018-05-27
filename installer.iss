[Setup]
AppName=Dark Souls Save Manager
AppVersion=1.0.4
DefaultDirName={localappdata}\DarkSoulsSaveManager
DefaultGroupName=Dark Souls Save Manager
UninstallDisplayIcon={app}\DarkSoulsSaveManager.exe
SolidCompression=yes
OutputBaseFilename=DarkSoulsSaveManagerInstaller

[Files]
Source: "dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\Dark Souls Save Manager"; Filename: "{app}\DarkSoulsSaveManager.exe"; AppUserModelID: "com.omgftw.dssm"
Name: "{group}\Uninstall Dark Souls Save Manager"; Filename: "{uninstallexe}";
