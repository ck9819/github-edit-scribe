
import React, { useState } from 'react';
import { Card, Row, Col, Table, Select, DatePicker, Button, Statistic } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);

  const { data: items = [] } = useSupabaseQuery('itemmaster', 'items');
  const { data: sales = [] } = useSupabaseQuery('sales', 'sales');
  const { data: purchaseOrders = [] } = useSupabaseQuery('purchase_orders', 'purchase_orders');
  const { data: stockTransactions = [] } = useSupabaseQuery('stock_transactions', 'stock_transactions');

  // Calculate inventory valuation
  const inventoryValue = items.reduce((total, item) => {
    return total + (item.currentstock * item.defaultprice || 0);
  }, 0);

  // Low stock items
  const lowStockItems = items.filter(item => 
    item.currentstock <= item.reorder_level && item.is_active
  );

  // Stock movement data for chart
  const stockMovementData = stockTransactions
    .filter(tx => dayjs(tx.transaction_date).isBetween(dateRange[0], dateRange[1]))
    .reduce((acc, tx) => {
      const date = dayjs(tx.transaction_date).format('MM/DD');
      const existing = acc.find(item => item.date === date);
      if (existing) {
        if (tx.transaction_type === 'IN') {
          existing.incoming += tx.quantity;
        } else {
          existing.outgoing += tx.quantity;
        }
      } else {
        acc.push({
          date,
          incoming: tx.transaction_type === 'IN' ? tx.quantity : 0,
          outgoing: tx.transaction_type === 'OUT' ? tx.quantity : 0,
        });
      }
      return acc;
    }, []);

  // Sales data for charts
  const salesData = sales
    .filter(sale => dayjs(sale.created_at).isBetween(dateRange[0], dateRange[1]))
    .reduce((acc, sale) => {
      const month = dayjs(sale.created_at).format('MMM');
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.sales += sale.total_after_tax || 0;
      } else {
        acc.push({
          month,
          sales: sale.total_after_tax || 0,
        });
      }
      return acc;
    }, []);

  const renderInventoryReport = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Inventory Value"
              value={inventoryValue}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Items"
              value={items.length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={lowStockItems.length}
              valueStyle={{ color: lowStockItems.length > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Items"
              value={items.filter(item => item.is_active).length}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Stock Movement">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockMovementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="incoming" fill="#52c41a" name="Stock In" />
                <Bar dataKey="outgoing" fill="#ff4d4f" name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Low Stock Items">
            <Table
              dataSource={lowStockItems}
              columns={[
                { title: 'Item Name', dataIndex: 'itemname', key: 'itemname' },
                { title: 'Current Stock', dataIndex: 'currentstock', key: 'currentstock' },
                { title: 'Reorder Level', dataIndex: 'reorder_level', key: 'reorder_level' },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderSalesReport = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Sales"
              value={sales.reduce((sum, sale) => sum + (sale.total_after_tax || 0), 0)}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={sales.length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={sales.length > 0 ? sales.reduce((sum, sale) => sum + (sale.total_after_tax || 0), 0) / sales.length : 0}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={sales.filter(sale => sale.deal_status === 'PENDING').length}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Sales Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );

  const renderPurchaseReport = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Purchase Orders"
              value={purchaseOrders.length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending POs"
              value={purchaseOrders.filter(po => po.status === 'PENDING').length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Confirmed POs"
              value={purchaseOrders.filter(po => po.status === 'CONFIRMED').length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total PO Value"
              value={purchaseOrders.reduce((sum, po) => sum + (po.total_amount || 0), 0)}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Reports & Analytics</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <Select
            value={reportType}
            onChange={setReportType}
            style={{ width: 200 }}
          >
            <Option value="inventory">Inventory Reports</Option>
            <Option value="sales">Sales Reports</Option>
            <Option value="purchase">Purchase Reports</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {reportType === 'inventory' && renderInventoryReport()}
      {reportType === 'sales' && renderSalesReport()}
      {reportType === 'purchase' && renderPurchaseReport()}
    </div>
  );
};

export default ReportsPage;
