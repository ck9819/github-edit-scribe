import React, { useState } from 'react';
import { Card, Row, Col, Table, Select, DatePicker, Button, Statistic, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);

  const { data: items = [], isLoading: itemsLoading } = useSupabaseQuery('itemmaster', 'items');
  const { data: sales = [], isLoading: salesLoading } = useSupabaseQuery('sales', 'sales');
  const { data: purchaseOrders = [], isLoading: poLoading } = useSupabaseQuery('purchase_orders', 'purchase_orders');
  const { data: stockTransactions = [], isLoading: stockLoading } = useSupabaseQuery('stock_transactions', 'stock_transactions');

  const isLoading = itemsLoading || salesLoading || poLoading || stockLoading;

  // Calculate inventory valuation safely
  const inventoryValue = Array.isArray(items) ? items.reduce((total, item) => {
    const stock = Number(item?.currentstock) || 0;
    const price = Number(item?.defaultprice) || 0;
    return total + (stock * price);
  }, 0) : 0;

  // Low stock items with safe comparison
  const lowStockItems = Array.isArray(items) ? items.filter(item => {
    if (!item) return false;
    const currentStock = Number(item.currentstock) || 0;
    const reorderLevel = Number(item.reorder_level) || 0;
    return currentStock <= reorderLevel && item.is_active;
  }) : [];

  // Stock movement data for chart
  const stockMovementData = Array.isArray(stockTransactions) ? stockTransactions
    .filter(tx => {
      if (!tx?.transaction_date) return false;
      const txDate = dayjs(tx.transaction_date);
      return txDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    })
    .reduce((acc, tx) => {
      const date = dayjs(tx.transaction_date).format('MM/DD');
      const quantity = Number(tx.quantity) || 0;
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        if (tx.transaction_type === 'IN') {
          existing.incoming += quantity;
        } else {
          existing.outgoing += quantity;
        }
      } else {
        acc.push({
          date,
          incoming: tx.transaction_type === 'IN' ? quantity : 0,
          outgoing: tx.transaction_type === 'OUT' ? quantity : 0,
        });
      }
      return acc;
    }, []) : [];

  // Sales data for charts
  const salesData = Array.isArray(sales) ? sales
    .filter(sale => {
      if (!sale?.created_at) return false;
      const saleDate = dayjs(sale.created_at);
      return saleDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    })
    .reduce((acc, sale) => {
      const month = dayjs(sale.created_at).format('MMM');
      const total = Number(sale.total_after_tax) || 0;
      const existing = acc.find(item => item.month === month);
      
      if (existing) {
        existing.sales += total;
      } else {
        acc.push({
          month,
          sales: total,
        });
      }
      return acc;
    }, []) : [];

  const totalSalesAmount = Array.isArray(sales) ? sales.reduce((sum, sale) => sum + (Number(sale?.total_after_tax) || 0), 0) : 0;
  const avgOrderValue = sales.length > 0 ? totalSalesAmount / sales.length : 0;

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
              value={Array.isArray(items) ? items.length : 0}
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
              value={Array.isArray(items) ? items.filter(item => item?.is_active).length : 0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Stock Movement">
            {stockMovementData.length > 0 ? (
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
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                No stock movement data available for the selected period
              </div>
            )}
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
              locale={{ emptyText: 'No low stock items' }}
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
              value={totalSalesAmount}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={Array.isArray(sales) ? sales.length : 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={avgOrderValue}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={Array.isArray(sales) ? sales.filter(sale => sale?.deal_status === 'PENDING').length : 0}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Sales Trend">
        {salesData.length > 0 ? (
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
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            No sales data available for the selected period
          </div>
        )}
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
              value={Array.isArray(purchaseOrders) ? purchaseOrders.length : 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending POs"
              value={Array.isArray(purchaseOrders) ? purchaseOrders.filter(po => po?.status === 'PENDING').length : 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Confirmed POs"
              value={Array.isArray(purchaseOrders) ? purchaseOrders.filter(po => po?.status === 'CONFIRMED').length : 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total PO Value"
              value={Array.isArray(purchaseOrders) ? purchaseOrders.reduce((sum, po) => sum + (Number(po?.total_amount) || 0), 0) : 0}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading reports data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
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
