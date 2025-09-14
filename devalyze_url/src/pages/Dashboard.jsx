import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  // Fake analytics data
  const data = [
    { name: "Desktop", value: 30 },
    { name: "Mobile", value: 25 },
    { name: "Tablet", value: 20 },
    { name: "E-Reader", value: 10 },
    { name: "Other", value: 15 },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#6366f1"];

  return (
    <div className="bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 p-6">
      
      {/* Latest Links */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <p className="font-medium">Techathon 2.0 Workshop</p>
                <a href="#" className="text-sm text-blue-500">
                  devalyze/dwyzzrrr
                </a>
              </div>
              <p className="text-sm text-gray-500">53 clicks</p>
            </div>
          ))}
          <button className="text-sm text-blue-600 flex items-center">
            See all links <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Latest QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Latest QR Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <p className="font-medium">Selfless Foundation</p>
                <a href="#" className="text-sm text-blue-500">
                  https://www.selflessheartsfoundation.com
                </a>
              </div>
              <p className="text-sm text-gray-500">53 scans</p>
            </div>
          ))}
          <button className="text-sm text-blue-600 flex items-center">
            See all QR Codes <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Your Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Your Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Link in bio</p>
              <a href="#" className="text-sm text-blue-500">
                devalyze.bio/Myportfolio
              </a>
            </div>
            <p className="text-sm text-gray-500">159 visits</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Company Name</p>
              <a href="#" className="text-sm text-blue-500">
                sho.rt/CompanyName
              </a>
            </div>
            <p className="text-sm text-gray-500">53 visits</p>
          </div>
          <button className="text-sm text-blue-600 flex items-center">
            See my pages <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Track clicks and scans across devices</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <PieChart width={300} height={250}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <p className="mt-2 font-semibold text-lg">459 clicks and scans</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
