import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FiActivity, FiDollarSign, FiShoppingCart, FiUsers } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dữ liệu mẫu cho biểu đồ
const chartData = [
    { name: 'Jan', value: 2800 },
    { name: 'Feb', value: 2200 },
    { name: 'Mar', value: 1800 },
    { name: 'Apr', value: 2800 },
    { name: 'May', value: 5900 },
    { name: 'Jun', value: 2700 },
    { name: 'Jul', value: 1600 },
    { name: 'Aug', value: 5200 },
    { name: 'Sep', value: 3700 },
    { name: 'Oct', value: 3400 },
    { name: 'Nov', value: 1400 },
    { name: 'Dec', value: 5400 },
];

const StatCard = ({ title, value, icon: Icon, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <Icon className="text-gray-400 w-5 h-5" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
        </p>
    </div>
);

const RecentSaleItem = ({ name, email, amount }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
            <div>
                <p className="font-medium text-sm text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{email}</p>
            </div>
        </div>
        <p className="font-medium text-sm text-gray-900">+${amount}</p>
    </div>
);

const ChartJSBarChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: data.map(item => item.value),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                },
            },
            title: {
                display: true,
                text: 'Monthly Revenue Overview',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: 'black',
                bodyColor: 'black',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default function DashboardHome() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-md">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Revenue" value="$45,231.89" icon={FiDollarSign} change="+20.1% from last month" />
                    <StatCard title="Subscriptions" value="+2350" icon={FiUsers} change="+180.1% from last month" />
                    <StatCard title="Sales" value="+12,234" icon={FiShoppingCart} change="+19% from last month" />
                    <StatCard title="Active Now" value="+573" icon={FiActivity} change="+201 since last hour" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
                    <ChartJSBarChart data={chartData} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
                    <p className="text-sm text-gray-500 mb-4">You made 265 sales this month.</p>
                    <div className="space-y-4">
                        <RecentSaleItem name="Olivia Martin" email="olivia.martin@email.com" amount="1,999.00" />
                        <RecentSaleItem name="Jackson Lee" email="jackson.lee@email.com" amount="39.00" />
                        <RecentSaleItem name="Isabella Nguyen" email="isabella.nguyen@email.com" amount="299.00" />
                        <RecentSaleItem name="William Kim" email="will@email.com" amount="99.00" />
                        <RecentSaleItem name="Sofia Davis" email="sofia.davis@email.com" amount="39.00" />
                    </div>
                </div>
            </div>
        </div>
    );
}
