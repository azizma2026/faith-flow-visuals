
import React from "react";
import { cn } from "@/lib/utils";
import { FEATURE_PAGES } from "@/config/featurePages";
import FeatureGridItem from "./FeatureGridItem";

interface DynamicIconGridProps {
  currentPage: number;
  className?: string;
}

const DynamicIconGrid: React.FC<DynamicIconGridProps> = ({ currentPage = 0, className }) => {
  const features = FEATURE_PAGES[currentPage] || [];

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {features.map((feature, index) => (
        <FeatureGridItem key={index} feature={feature} />
      ))}
    </div>
  );
};

export default DynamicIconGrid;
