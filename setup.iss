; RemoteAgent Installer: setup.iss
[Setup]
AppName=Remote Agent
AppVersion=1.0
DefaultDirName={autopf}\RemoteAgent
OutputDir=.
OutputBaseFilename=RemoteAgentInstaller
Compression=lzma
SolidCompression=yes

[Files]
Source: "dist\\agent-win.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "dist\\start-agent.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{startup}\Remote Agent"; Filename: "{app}\\start-agent.exe"; WorkingDir: "{app}"

[Run]
Filename: "{app}\\start-agent.exe"; Description: "Start Agent"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: files; Name: "{app}\\agent-win.exe"