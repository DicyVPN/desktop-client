!macro customWelcomePage
  # Welcome Page is not added by default for installer.
  !insertMacro MUI_PAGE_WELCOME
!macroend

!macro customInstall
  File /oname=$PLUGINSDIR\wiresock.msi "${BUILD_RESOURCES_DIR}\wiresock.msi"
  ExecWait '"msiexec" /i "$PLUGINSDIR\wiresock.msi" /quiet /qn /norestart'

  File /oname=$PLUGINSDIR\openvpn.msi "${BUILD_RESOURCES_DIR}\openvpn.msi"
  ExecWait '"msiexec" /i "$PLUGINSDIR\openvpn.msi" /quiet /qn /norestart'

!macroend


