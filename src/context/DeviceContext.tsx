
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DeviceContextType {
  isDeviceConnected: boolean;
  setIsDeviceConnected: (connected: boolean) => void;
  deviceName: string;
  setDeviceName: (name: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('');

  return (
    <DeviceContext.Provider
      value={{
        isDeviceConnected,
        setIsDeviceConnected,
        deviceName,
        setDeviceName,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
