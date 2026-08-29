// Serverless Function Vercel
// Endpoint: https://admin-kamu.vercel.app/api/save

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;
        if (!data || !data.timestamp) {
            return res.status(400).json({ error: 'Data tidak valid' });
        }

        // ==========================================
        // GANTI DUA NILAI INI DENGAN MILIK KAMU
        // Dari jsonbin.io -> Access Keys (X-Master-Key)
        // Dari jsonbin.io -> Bin ID yang sudah dibuat
        // ==========================================
        const JSONBIN_API_KEY = 'YOUR_JSONBIN_API_KEY';
        const JSONBIN_ID = 'YOUR_JSONBIN_ID';

        // Ambil data lama
        let records = [];
        try {
            const getRes = await fetch(
                `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`,
                {
                    headers: { 'X-Master-Key': JSONBIN_API_KEY }
                }
            );
            const oldData = await getRes.json();
            records = oldData.record?.records || [];
        } catch (e) {
            // Kalau bin kosong atau gagal, mulai dari array kosong
            records = [];
        }

        // Tambahkan data baru
        records.unshift(data);

        // Batasi 50 data terakhir supaya tidak melebihi limit gratis JSONBin
        if (records.length > 50) {
            records = records.slice(0, 50);
        }

        // Simpan kembali
        await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({ records: records })
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Gagal menyimpan data' });
    }
}
