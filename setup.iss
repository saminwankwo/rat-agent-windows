[Setup]
AppName=Remote Agent (Admin)  
AppVersion=1.0  
DefaultDirName={autopf}\RemoteAgent  
PrivilegesRequired=admin  
DisableWelcomePage=yes  
DisableDirPage=yes  
DisableProgramGroupPage=yes  
Compression=lzma  
SolidCompression=yes  
OutputDir=Output
OutputBaseFilename=RemoteAgentInstaller

[Files]
Source: "dist\agent-win-x64.exe"; DestDir: "{app}"; Flags: ignoreversion  
Source: "dist\start-agent-x64.exe"; DestDir: "{app}"; Flags: ignoreversion  

[Run]
Filename: "{app}\start-agent-x64.exe"; Flags: nowait postinstall skipifsilent runhidden  

[Icons]
Name: "{commonstartup}\Remote Agent"; Filename: "{app}\start-agent-x64.exe"; WorkingDir: "{app}"  

[UninstallDelete]
Type: files; Name: "{app}\*"