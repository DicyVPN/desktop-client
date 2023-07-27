!macro customInstall
  File /oname=$PLUGINSDIR\wiresock.msi "${BUILD_RESOURCES_DIR}\wiresock.msi"
  ExecWait '"msiexec" /i "$PLUGINSDIR\wiresock.msi" /quiet /qn /norestart'

  File /oname=$PLUGINSDIR\openvpn.msi "${BUILD_RESOURCES_DIR}\openvpn.msi"
  ExecWait '"msiexec" /i "$PLUGINSDIR\openvpn.msi" /quiet /qn /norestart ADDLOCAL=OpenVPN.Service,Drivers.OvpnDco,OpenVPN,OpenVPN.PLAP.Register,Drivers,Drivers.TAPWindows6,Drivers.Wintun'

  WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Run" "${PRODUCT_NAME}" '"$InstDir\${PRODUCT_FILENAME}.exe" --silent'
!macroend

!macro customUninstall
  DeleteRegValue HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Run" "${PRODUCT_NAME}"
!macroend
