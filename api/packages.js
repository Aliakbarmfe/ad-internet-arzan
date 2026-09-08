const DB_URL = "https://internet-arzan-default-rtdb.firebaseio.com";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { operator, id } = req.query;

  try {
    // دریافت لیست همه بسته‌ها
    if (req.method === 'GET' && !operator) {
      const response = await fetch(`${DB_URL}/packages.json`);
      const data = await response.json();
      return res.status(200).json(data || {});
    }

    if (!operator || (operator !== 'mci' && operator !== 'irancell')) {
      return res.status(400).json({ error: 'اپراتور نامعتبر است' });
    }

    // ثبت بسته جدید
    if (req.method === 'POST') {
      const packageData = { ...req.body, createdAt: Date.now() };
      const response = await fetch(`${DB_URL}/packages/${operator}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      });
      const data = await response.json();
      return res.status(200).json({ message: 'بسته ثبت شد', id: data.name });
    }

    // ویرایش بسته
    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'شناسه بسته الزامی است' });
      await fetch(`${DB_URL}/packages/${operator}/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      return res.status(200).json({ message: 'بسته ویرایش شد' });
    }

    // حذف بسته
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'شناسه بسته الزامی است' });
      await fetch(`${DB_URL}/packages/${operator}/${id}.json`, {
        method: 'DELETE'
      });
      return res.status(200).json({ message: 'بسته حذف شد' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
