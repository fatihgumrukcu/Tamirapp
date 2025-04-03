import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
  };
  
  const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => {},
  });
  
  export const useTheme = () => useContext(ThemeContext);
  
  export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    useEffect(() => {
      const loadTheme = async () => {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark') {
          setIsDarkMode(true);
        } else {
          setIsDarkMode(false);
        }
      };
  
      loadTheme();
    }, []);
  
    const toggleTheme = async () => {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
    };
  
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  