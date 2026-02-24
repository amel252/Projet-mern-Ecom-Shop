import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        mode: "index",
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: "Sales & Orders Data",
        },
    },
    scales: {
        y: {
            type: "linear",
            display: true,
            position: "left",
        },
        y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
    labels,
    datasets: [
        {
            label: "Sales",
            data: [14, 45, 68, 49, 23, 44],
            borderColor: "#198753",
            backgroundColor: "rgba(42, 117, 83, 0.5)",
            yAxisID: "y",
        },
        {
            label: "orders",
            data: [14, 35, 78, 39, 83, 42],
            borderColor: "#d42b2b",
            backgroundColor: "rgba(201,68,82, 0.5)",
            yAxisID: "y1",
        },
    ],
};

export default function SalesChart() {
    return <Line options={options} data={data} />;
}
