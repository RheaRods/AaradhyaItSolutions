export type Inquiry = {
  id: string
  product: string
  method: 'WhatsApp' | 'Phone' | 'Website'
  message: string
  time: string
  status: 'New' | 'Seen' | 'Replied' | 'Resolved'
}

export const inquiries: Inquiry[] = [
  {
    id: 'INQ-001',
    product: 'Pharmacy Billing Software',
    method: 'WhatsApp',
    message: 'Hi, I need billing software for my new outlet. Can you share pricing?',
    time: '2 hours ago',
    status: 'New'
  },
  {
    id: 'INQ-002',
    product: 'Retail ERP System',
    method: 'Website',
    message: 'Can you share product details and module list?',
    time: '5 hours ago',
    status: 'Seen'
  },
  {
    id: 'INQ-003',
    product: 'Barcode Label Printer',
    method: 'Phone',
    message: 'Called to inquire about bulk printer prices for our warehouse.',
    time: 'Yesterday',
    status: 'Replied'
  },
  {
    id: 'INQ-004',
    product: 'Enterprise Server Rack',
    method: 'WhatsApp',
    message: 'Looking for a quote for 50 licenses for our enterprise team.',
    time: '10:45 AM',
    status: 'New'
  },
  {
    id: 'INQ-005',
    product: 'Security Audit',
    method: 'Phone',
    message: 'Callback requested regarding site security assessment.',
    time: '09:12 AM',
    status: 'Seen'
  },
  {
    id: 'INQ-006',
    product: 'Cloud Hosting',
    method: 'Website',
    message: 'Interested in dedicated servers for our ecommerce platform.',
    time: 'Yesterday',
    status: 'Replied'
  },
  {
    id: 'INQ-007',
    product: 'IT Consulting',
    method: 'WhatsApp',
    message: 'Need advice on hybrid cloud migration for our office.',
    time: 'Yesterday',
    status: 'New'
  },
  {
    id: 'INQ-008',
    product: 'Custom API',
    method: 'Website',
    message: 'Can you integrate with Salesforce for our CRM workflow?',
    time: '2 days ago',
    status: 'Resolved'
  }
]