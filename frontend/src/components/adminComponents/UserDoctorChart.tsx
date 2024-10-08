import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Define the interface for the data prop
interface UserDoctorData {
    name: string; // This represents the name or label for each bar
    users: number; // Number of users registered
    doctors: number; // Number of doctors registered
}

interface UserDoctorChartProps {
    data: UserDoctorData[]; // Array of data objects
}

const UserDoctorChart: React.FC<UserDoctorChartProps> = ({ data }) => {
    console.log("sgvfhbvs",data);
    
    return (
        <ResponsiveContainer width="95%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickCount={12} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="users"
                    fill="#8884d8"
                    name="Users Registered"
                    activeBar={<Rectangle fill="pink" stroke="blue" />} // Active bar style
                />
                <Bar
                    dataKey="doctors"
                    fill="#82ca9d"
                    name="Doctors Registered"
                    activeBar={<Rectangle fill="gold" stroke="purple" />} // Active bar style
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default UserDoctorChart;
