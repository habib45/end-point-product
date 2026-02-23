import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import ContentHeader from '@/components/ui/ContentHeader'
import { revenueData, salesByCategory, weeklyVisitors } from '@/services/mockData'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
)

const chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'top' as const } },
  scales: { y: { beginAtZero: true } },
}

export default function Charts() {
  return (
    <>
      <ContentHeader title="Charts" breadcrumbs={[{ label: 'UI Kit' }, { label: 'Charts' }]} />

      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Revenue vs Expenses (Line Chart)</h5>
            </div>
            <div className="card-body">
              <Line data={revenueData} options={chartOptions} height={80} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Weekly Visitors (Bar Chart)</h5>
            </div>
            <div className="card-body">
              <Bar data={weeklyVisitors} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Sales by Category (Doughnut)</h5>
            </div>
            <div className="card-body d-flex align-items-center">
              <Doughnut data={salesByCategory} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
