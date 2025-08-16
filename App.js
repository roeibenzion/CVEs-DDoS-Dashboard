import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Search, Filter, Download, Eye, AlertTriangle, Shield, Activity, Network } from 'lucide-react';

const CVEDashboard = () => {
  const [cveData, setCveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCorporation, setSelectedCorporation] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedProtocol, setSelectedProtocol] = useState('all');

  // Sample data structure - in real implementation, this would come from OpenCVE API
  const sampleCVEData = [
    {
      id: 'CVE-2024-0001',
      corporation: 'Apache',
      product: 'HTTP Server',
      language: 'C',
      protocol: 'HTTP',
      severity: 'High',
      score: 8.5,
      description: 'DDoS vulnerability in Apache HTTP Server allowing resource exhaustion',
      published: '2024-01-15',
      recurrenceType: 'Resource Exhaustion',
      validated: true
    },
    {
      id: 'CVE-2024-0002',
      corporation: 'Nginx',
      product: 'Web Server',
      language: 'C',
      protocol: 'HTTP',
      severity: 'Medium',
      score: 6.8,
      description: 'Memory leak in Nginx leading to potential DDoS',
      published: '2024-02-10',
      recurrenceType: 'Memory Leak',
      validated: true
    },
    {
      id: 'CVE-2024-0003',
      corporation: 'Microsoft',
      product: 'IIS',
      language: 'C++',
      protocol: 'HTTP',
      severity: 'High',
      score: 7.9,
      description: 'Buffer overflow in IIS causing service disruption',
      published: '2024-03-05',
      recurrenceType: 'Buffer Overflow',
      validated: false
    },
    {
      id: 'CVE-2024-0004',
      corporation: 'Cisco',
      product: 'Router Firmware',
      language: 'C',
      protocol: 'TCP',
      severity: 'Critical',
      score: 9.2,
      description: 'TCP flood vulnerability in Cisco router firmware',
      published: '2024-01-28',
      recurrenceType: 'Protocol Flood',
      validated: true
    },
    {
      id: 'CVE-2024-0005',
      corporation: 'Oracle',
      product: 'Database',
      language: 'Java',
      protocol: 'TCP',
      severity: 'Medium',
      score: 5.5,
      description: 'Connection exhaustion in Oracle Database',
      published: '2024-02-20',
      recurrenceType: 'Resource Exhaustion',
      validated: true
    }
  ];

  useEffect(() => {
    // Simulate API call to OpenCVE
    setLoading(true);
    setTimeout(() => {
      setCveData(sampleCVEData);
      setFilteredData(sampleCVEData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = cveData.filter(cve => {
      const matchesSearch = cve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cve.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cve.product.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCorp = selectedCorporation === 'all' || cve.corporation === selectedCorporation;
      const matchesLang = selectedLanguage === 'all' || cve.language === selectedLanguage;
      const matchesProtocol = selectedProtocol === 'all' || cve.protocol === selectedProtocol;
      
      return matchesSearch && matchesCorp && matchesLang && matchesProtocol;
    });
    setFilteredData(filtered);
  }, [cveData, searchTerm, selectedCorporation, selectedLanguage, selectedProtocol]);

  // Data aggregation for charts
  const corporationData = Object.entries(
    filteredData.reduce((acc, cve) => {
      acc[cve.corporation] = (acc[cve.corporation] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const languageData = Object.entries(
    filteredData.reduce((acc, cve) => {
      acc[cve.language] = (acc[cve.language] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const protocolData = Object.entries(
    filteredData.reduce((acc, cve) => {
      acc[cve.protocol] = (acc[cve.protocol] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const recurrenceData = Object.entries(
    filteredData.reduce((acc, cve) => {
      acc[cve.recurrenceType] = (acc[cve.recurrenceType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const severityData = Object.entries(
    filteredData.reduce((acc, cve) => {
      acc[cve.severity] = (acc[cve.severity] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-red-400';
      case 'Medium': return 'bg-yellow-400';
      case 'Low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const fetchCVEData = async () => {
    setLoading(true);
    // In real implementation, this would call OpenCVE API
    // Example: const response = await fetch('https://opencve.io/api/cve?search=ddos');
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const exportData = () => {
    const csvContent = [
      ['CVE ID', 'Corporation', 'Product', 'Language', 'Protocol', 'Severity', 'Score', 'Recurrence Type', 'Validated'],
      ...filteredData.map(cve => [
        cve.id, cve.corporation, cve.product, cve.language, cve.protocol, 
        cve.severity, cve.score, cve.recurrenceType, cve.validated
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ddos-cves.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DDoS CVE Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchCVEData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Activity className="h-4 w-4 mr-2" />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search CVEs</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search CVE ID, description, product..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Corporation</label>
              <select
                value={selectedCorporation}
                onChange={(e) => setSelectedCorporation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Corporations</option>
                {Array.from(new Set(cveData.map(cve => cve.corporation))).map(corp => (
                  <option key={corp} value={corp}>{corp}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Languages</option>
                {Array.from(new Set(cveData.map(cve => cve.language))).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Protocol</label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Protocols</option>
                {Array.from(new Set(cveData.map(cve => cve.protocol))).map(protocol => (
                  <option key={protocol} value={protocol}>{protocol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
              <select
                value={activeView}
                onChange={(e) => setActiveView(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overview">Overview</option>
                <option value="corporation">By Corporation</option>
                <option value="language">By Language</option>
                <option value="protocol">By Protocol</option>
                <option value="recurrence">By Recurrence Type</option>
                <option value="validation">Validation Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total CVEs</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredData.filter(cve => cve.severity === 'Critical').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Validated</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredData.filter(cve => cve.validated).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Network className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Protocols</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Array.from(new Set(filteredData.map(cve => cve.protocol))).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {(activeView === 'overview' || activeView === 'corporation') && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CVEs by Corporation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={corporationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {(activeView === 'overview' || activeView === 'language') && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CVEs by Programming Language</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {(activeView === 'overview' || activeView === 'protocol') && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CVEs by Network Protocol</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={protocolData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {(activeView === 'overview' || activeView === 'recurrence') && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CVEs by Recurrence Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={recurrenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {recurrenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* CVE Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">CVE Details</h3>
            <p className="text-sm text-gray-600">Showing {filteredData.length} of {cveData.length} CVEs</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CVE ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corporation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recurrence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((cve) => (
                  <tr key={cve.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{cve.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cve.corporation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cve.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cve.language}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cve.protocol}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getSeverityColor(cve.severity)}`}>
                        {cve.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cve.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cve.recurrenceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cve.validated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cve.validated ? 'Validated' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEDashboard;