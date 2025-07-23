; setup.iss

[Setup]
AppName=Remote Agent
AppVersion=1.0
DefaultDirName={autopf}\RemoteAgent
OutputDir=.
OutputBaseFilename=RemoteAgentInstaller
Compression=lzma
SolidCompression=yes

[Files]
; Install the correct agent and launcher based on OS bitness
Source: "dist\agent-win-x64.exe"; DestDir: "{app}"; Flags: ignoreversion; Check: Is64BitInstallMode
Source: "dist\agent-win-x86.exe"; DestDir: "{app}"; Flags: ignoreversion; Check: not Is64BitInstallMode
Source: "dist\start-agent-x64.exe"; DestDir: "{app}"; Flags: ignoreversion; Check: Is64BitInstallMode
Source: "dist\start-agent-x86.exe"; DestDir: "{app}"; Flags: ignoreversion; Check: not Is64BitInstallMode

[Icons]
Name: "{userstartup}\Remote Agent"; Filename: "{app}\start-agent-{#if Is64BitInstallMode}x64{#else}x86{#endif}.exe"; WorkingDir: "{app}"

[Run]
Filename: "{app}\start-agent-{#if Is64BitInstallMode}x64{#else}x86{#endif}.exe"; Description: "Start Agent"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: files; Name: "{app}\agent-win-{#if Is64BitInstallMode}x64{#else}x86{#endif}.exe"
Type: files; Name: "{app}\start-agent-{#if Is64BitInstallMode}x64{#else}x86{#endif}.exe"
