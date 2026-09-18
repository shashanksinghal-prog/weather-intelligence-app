import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  AlertCircle,
} from 'lucide-react';

interface WeatherIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconName,
  className = 'w-6 h-6',
  size,
}) => {
  const props = { className, size };

  switch (iconName) {
    case 'Sun':
      return <Sun {...props} className={`${className} text-amber-500`} />;
    case 'Moon':
      return <Moon {...props} className={`${className} text-indigo-400`} />;
    case 'CloudSun':
      return <CloudSun {...props} className={`${className} text-amber-500`} />;
    case 'CloudMoon':
      return <CloudMoon {...props} className={`${className} text-indigo-400`} />;
    case 'Cloud':
      return <Cloud {...props} className={`${className} text-slate-400`} />;
    case 'CloudFog':
      return <CloudFog {...props} className={`${className} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} className={`${className} text-sky-400`} />;
    case 'CloudRain':
      return <CloudRain {...props} className={`${className} text-blue-500`} />;
    case 'CloudSnow':
      return <CloudSnow {...props} className={`${className} text-sky-300`} />;
    case 'CloudLightning':
      return <CloudLightning {...props} className={`${className} text-amber-400`} />;
    default:
      return <AlertCircle {...props} className={`${className} text-slate-400`} />;
  }
};
