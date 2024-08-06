// components/ThemeToggle.tsx
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    
    <div>
        {theme==='light'?<SunOutlined onClick={()=>{
                setTheme('dark')
              }}/>: <MoonOutlined onClick={()=>{
                setTheme('light' )
              }}/>}
    </div>
  );
};

export default ThemeToggle;
