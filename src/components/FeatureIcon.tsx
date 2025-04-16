
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureIconProps {
  title: string;
  icon: LucideIcon;
  description?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({
  title,
  icon: Icon,
  description,
  color = "bg-islamic-green",
  onClick,
  className
}) => {
  return (
    <div 
      className={cn("feature-icon flex flex-col items-center justify-center p-4 cursor-pointer", className)}
      onClick={onClick}
    >
      <div className={cn("rounded-xl p-3 mb-2", color)}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-medium text-islamic-dark-navy text-sm">{title}</h3>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

export default FeatureIcon;
