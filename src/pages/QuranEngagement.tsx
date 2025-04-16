
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Clock, Award, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const QuranEngagement = () => {
  const { currentLanguage } = useLanguage();
  
  // Sample data for the radial chart
  const data = [
    { name: "Sunday", value: 45, color: "#1D645D" },
    { name: "Monday", value: 30, color: "#2A9D8F" },
    { name: "Tuesday", value: 60, color: "#E9C46A" },
    { name: "Wednesday", value: 25, color: "#F4A261" },
    { name: "Thursday", value: 50, color: "#E76F51" },
    { name: "Friday", value: 75, color: "#2A6B67" },
    { name: "Saturday", value: 40, color: "#264653" },
  ];
  
  // Weekly total calculation
  const weeklyTotal = data.reduce((total, day) => total + day.value, 0);
  
  // Radial chart configuration
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${data[index].name.slice(0, 3)}`}
      </text>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-islamic-dark-navy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir={currentLanguage.direction}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-islamic-dark-navy dark:text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-islamic-dark-navy dark:text-white">
            Quran Engagement
          </h1>
        </div>

        <Card className="mb-6 overflow-hidden border-none shadow-md">
          <CardHeader className="bg-islamic-green text-white pb-2">
            <CardTitle className="text-xl">Weekly Engagement</CardTitle>
            <CardDescription className="text-white/80">
              Time spent with Quran this week
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ChartContainer
                config={{
                  Sunday: { color: "#1D645D" },
                  Monday: { color: "#2A9D8F" },
                  Tuesday: { color: "#E9C46A" },
                  Wednesday: { color: "#F4A261" },
                  Thursday: { color: "#E76F51" },
                  Friday: { color: "#2A6B67" },
                  Saturday: { color: "#264653" },
                }}
              >
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-islamic-green" />
                <span className="text-sm font-medium">Weekly Total:</span>
              </div>
              <span className="font-bold text-lg">{weeklyTotal} minutes</span>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-islamic-gold" />
                <span className="text-sm font-medium">Lifetime Engagement:</span>
              </div>
              <span className="font-bold text-lg">437 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 overflow-hidden border-none shadow-md">
          <CardHeader className="bg-islamic-blue text-white pb-2">
            <CardTitle className="text-xl">Sadqa Jaria</CardTitle>
            <CardDescription className="text-white/80">
              Gift Qurans and spread knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-2 text-islamic-blue" />
                <span className="text-sm font-medium">Qurans Gifted:</span>
              </div>
              <span className="font-bold text-lg">5</span>
            </div>
            
            <button className="w-full py-3 bg-islamic-gold hover:bg-islamic-gold/90 text-white rounded-lg font-medium flex items-center justify-center transition-all">
              <Gift className="h-5 w-5 mr-2" />
              Purchase Gift Quran
            </button>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8 mb-4">
          <h2 className="text-xl font-bold text-islamic-dark-navy dark:text-white">
            Share Your Journey
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Inspire others with your Quran reading consistency
          </p>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-islamic-green rounded-lg text-white">
            <Heart className="h-5 w-5" />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-islamic-blue rounded-lg text-white">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuranEngagement;
