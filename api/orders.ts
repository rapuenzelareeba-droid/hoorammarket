export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { items, subtotal, total, shippingAddress } = req.body || {};
    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      items: items || [],
      subtotal: Number(subtotal) || 0,
      total: Number(total) || 0,
      shippingAddress: shippingAddress || {},
      status: 'pending',
      createdAt: new Date().toISOString(),
      trackingNumber: `HRM-${Math.floor(100000 + Math.random() * 900000)}`
    };
    return res.status(201).json(newOrder);
  }

  return res.status(200).json([]);
}
