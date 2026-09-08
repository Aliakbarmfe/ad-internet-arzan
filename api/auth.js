const DB_URL = "https://internet-arzan-default-rtdb.firebaseio.com";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${DB_URL}/settings/password.json`);
      let pass = await response.json();

      // اگر رمز عبور در دیتابیس وجود نداشت، fizon ذخیره می‌شود
      if (!pass) {
        pass = "fizon";
        await fetch(`${DB_URL}/settings/password.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify("fizon")
        });
      }

      return res.status(200).json({ password: pass });
    }

    if (req.method === 'POST') {
      const { newPassword } = req.body;
      if (!newPassword) return res.status(400).json({ error: 'رمز جدید الزامی است' });

      await fetch(`${DB_URL}/settings/password.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPassword)
      });

      return res.status(200).json({ message: 'رمز عبور تغییر یافت' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
