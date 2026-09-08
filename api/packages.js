const db = require('./firebase-config');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { operator, id } = req.query; // operator: 'mci' | 'irancell'

  if (req.method === 'GET') {
    // دریافت لیست تمامی بسته‌ها
    const snapshot = await db.ref('packages').once('value');
    return res.status(200).json(snapshot.val() || {});
  }

  if (!operator || (operator !== 'mci' && operator !== 'irancell')) {
    return res.status(400).json({ error: 'اپراتور نامعتبر است (mci یا irancell)' });
  }

  const path = `packages/${operator}`;

  if (req.method === 'POST') {
    // ایجاد بسته جدید
    const packageData = { ...req.body, createdAt: Date.now() };
    const newRef = db.ref(path).push();
    await newRef.set(packageData);
    return res.status(200).json({ message: 'بسته ثبت شد', id: newRef.key });
  }

  if (req.method === 'PUT') {
    // ویرایش بسته
    if (!id) return res.status(400).json({ error: 'شناسه بسته الزامی است' });
    await db.ref(`${path}/${id}`).update(req.body);
    return res.status(200).json({ message: 'بسته ویرایش شد' });
  }

  if (req.method === 'DELETE') {
    // حذف بسته
    if (!id) return res.status(400).json({ error: 'شناسه بسته الزامی است' });
    await db.ref(`${path}/${id}`).remove();
    return res.status(200).json({ message: 'بسته حذف شد' });
  }
};
