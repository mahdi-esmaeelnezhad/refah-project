const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/pay', (req, res) => {
  const { amount, orderId } = req.body;
  console.log(amount, orderId);
  setTimeout(() => {
    if (Math.random() > 0.2) {
      res.json({
        status: 'approved',
        message: 'پرداخت با موفقیت انجام شد',
        refNum: Math.floor(Math.random() * 1000000000),
        traceNum: Math.floor(Math.random() * 1000000),
      });
    } else {
      res.json({
        status: 'failed',
        message: 'پرداخت ناموفق بود',
      });
    }
  }, 3000);
});

app.listen(3001, () => console.log('Fake POS middleware running on port 3001')); 