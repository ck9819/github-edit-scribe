import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Statistic, Tabs, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { DownloadOutlined, TrendingUpOutlined, TrendingDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const AdvancedReports = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const { data: items = [] } = useSupabaseQuery('itemmaster', 'items');
  const { data: sales = [] } = useSupabaseQuery('sales', 'sales');
  const { data: stockTransactions = [] } = useSupabaseQuery('stock_transactions', 'stock_transactions');
  const { data: warehouses = [] } = useSupabaseQuery('warehouses', 'warehouses');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Calculate inventory valuation
  const inventoryValuation = items.map(item => ({
    name: item.itemname,
    value: (item.currentstock || 0) * (item.defaultprice || 0),
    quantity: item.currentstock || 0,
    price: item.defaultprice || 0,
  })).filter(item => item.value > 0);

  // ABC Analysis
  const totalValue = inventoryValuation.reduce((sum, item) => sum + item.value, 0);
  const abcAnalysis = inventoryValuation
    .sort((a, b) => b.value - a.value)
    .map((item, index, arr) => {
      const cumulativeValue = arr.slice(0, index + 1).reduce((sum, i) => sum + i.value, 0);
      const percentage = (cumulativeValue / totalValue) * 100;
      let category = 'C';
      if (percentage <= 80) category = 'A';
      else if (percentage <= 95) category = 'B';
      
      return {
        ...item,
        percentage: (item.value / totalValue) * 100,
        cumulativePercentage: percentage,
        category,
      };
    });

  // Fast/Slow Moving Analysis
  const salesVelocity = items.map(item => {
    // Simplified calculation - in real implementation, extract from sales.items JSONB
    const recentSales = Math.floor(Math.random() * 50); // Mock data
    const avgDailySales = recentSales / 30;
    
    let velocity = 'SLOW_MOVING';
    if (avgDailySales > 2) velocity = 'FAST_MOVING';
    else if (avgDailySales > 0.5) velocity = 'MEDIUM_MOVING';
    
    return {
      itemname: item.itemname,
      currentstock: item.currentstock || 0,
      recentSales,
      avgDailySales: avgDailySales.toFixed(2),
      velocity,
      daysOfStock: avgDailySales > 0 ? Math.ceil((item.currentstock || 0) / avgDailySales) : 999,
    };
  });

  // Sales trend data
  const salesTrend = sales
    .filter(sale => {
      const saleDate = dayjs(sale.created_at);
      return saleDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    })
    .reduce((acc, sale) => {
      const month = dayjs(sale.created_at).format('MMM YYYY');
      const existing = acc.find(item => item.month === month);
      const amount = sale.total_after_tax || 0;
      
      if (existing) {
        existing.sales += amount;
        existing.orders += 1;
      } else {
        acc.push({
          month,
          sales: amount,
          orders: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => dayjs(a.month, 'MMM YYYY').valueOf() - dayjs(b.month, 'MMM YYYY').valueOf());

  // Stock movement analysis
  const stockMovement = stockTransactions
    .filter(tx => {
      const txDate = dayjs(tx.transaction_date);
      return txDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    })
    .reduce((acc, tx) => {
      const date = dayjs(tx.transaction_date).format('DD/MM');
      const existing = acc.find(item => item.date === date);
      const quantity = tx.quantity || 0;
      
      if (existing) {
        if (tx.transaction_type === 'IN') {
          existing.stockIn += quantity;
        } else {
          existing.stockOut += quantity;
        }
      } else {
        acc.push({
          date,
          stockIn: tx.transaction_type === 'IN' ? quantity : 0,
          stockOut: tx.transaction_type === 'OUT' ? quantity : 0,
        });
      }
      return acc;
    }, []);

  // Velocity distribution for pie chart
  const velocityDistribution = [
    { name: 'Fast Moving', value: salesVelocity.filter(item => item.velocity === 'FAST_MOVING').length },
    { name: 'Medium Moving', value: salesVelocity.filter(item => item.velocity === 'MEDIUM_MOVING').length },
    { name: 'Slow Moving', value: salesVelocity.filter(item => item.velocity === 'SLOW_MOVING').length },
  ];

  const abcColumns = [
    { title: 'Item Name', dataIndex: 'name', key: 'name' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Unit Price', dataIndex: 'price', key: 'price', render: (price) => `₹${price.toFixed(2)}` },
    { title: 'Total Value', dataIndex: 'value', key: 'value', render: (value) => `₹${value.toFixed(2)}` },
    { title: '% of Total', dataIndex: 'percentage', key: 'percentage', render: (pct) => `${pct.toFixed(2)}%` },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => (
      <span style={{ 
        color: cat === 'A' ? '#52c41a' : cat === 'B' ? '#faad14' : '#ff4d4f',
        fontWeight: 'bold'
      }}>
        {cat}
      </span>
    )},
  ];

  const velocityColumns = [
    { title: 'Item Name', dataIndex: 'itemname', key: 'itemname' },
    { title: 'Current Stock', dataIndex: 'currentstock', key: 'currentstock' },
    { title: 'Recent Sales (30d)', dataIndex: 'recentSales', key: 'recentSales' },
    { title: 'Avg Daily Sales', dataIndex: 'avgDailySales', key: 'avgDailySales' },
    { title: 'Days of Stock', dataIndex: 'daysOfStock', key: 'daysOfStock', render: (days) => days === 999 ? '∞' : days },
    { title: 'Velocity', dataIndex: 'velocity', key: 'velocity', render: (velocity) => (
      <span style={{ 
        color: velocity === 'FAST_MOVING' ? '#52c41a' : velocity === 'MEDIUM_MOVING' ? '#faad14' : '#ff4d4f',
        fontWeight: 'bold'
      }}>
        {velocity.replace('_', ' ')}
      </span>
    )},
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Advanced Reports & Analytics</h2>
        <Space>
          <Select
            value={selectedWarehouse}
            onChange={setSelectedWarehouse}
            style={{ width: 200 }}
          >
            <Option value="all">All Warehouses</Option>
            {warehouses.map(warehouse => (
              <Option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </Option>
            ))}
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button icon={<DownloadOutlined />}>Export</Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Total Inventory Value"
                  value={totalValue}
                  prefix="₹"
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Fast Moving Items"
                  value={velocityDistribution[0].value}
                  prefix={<TrendingUpOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Slow Moving Items"
                  value={velocityDistribution[2].value}
                  prefix={<TrendingDownOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Total SKUs"
                  value={items.length}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Sales Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
                    <Area type="monotone" dataKey="sales" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Stock Movement">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockMovement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stockIn" fill="#52c41a" name="Stock In" />
                    <Bar dataKey="stockOut" fill="#ff4d4f" name="Stock Out" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="ABC Analysis" key="abc">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card title="Category Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Category A', value: abcAnalysis.filter(item => item.category === 'A').length },
                        { name: 'Category B', value: abcAnalysis.filter(item => item.category === 'B').length },
                        { name: 'Category C', value: abcAnalysis.filter(item => item.category === 'C').length },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card title="ABC Analysis Details">
                <Table
                  columns={abcColumns}
                  dataSource={abcAnalysis}
                  rowKey="name"
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Velocity Analysis" key="velocity">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card title="Velocity Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={velocityDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {velocityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card title="Item Velocity Details">
                <Table
                  columns={velocityColumns}
                  dataSource={salesVelocity}
                  rowKey="itemname"
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Inventory Valuation" key="valuation">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="Inventory Valuation by Item">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={inventoryValuation.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']} />
                    <Bar dataKey="value" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdvancedReports;