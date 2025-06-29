require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const path         = require('path');
const sequelize    = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');

const app = express();

/* 1) Проверяем подключение к БД */
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connected to PostgreSQL'))
  .catch(err => { console.error('❌ DB connection failed:', err); process.exit(1); });

/* 2) Middleware */
app.use(cors({ credentials:true, origin:true })); // разрешаем cookie CORS
app.use(cookieParser());
app.use(express.json());

/* 3) Раздаём статику */
app.use(express.static(path.join(__dirname, 'public')));

/* 4) Маршруты авторизации (login / me / logout) */
app.use('/api/auth', authRoutes);

/* 5) Остальные API-роуты — проверка ролей внутри самих роутеров */
app.use('/api/categories',  require('./src/routes/categoryRoutes'));
app.use('/api/items',       require('./src/routes/itemRoutes'));
app.use('/api/extras',      require('./src/routes/extraRoutes'));
app.use('/api/staff',       require('./src/routes/staffRoutes'));
app.use('/api/customers',   require('./src/routes/customerRoutes'));

app.use('/api/orders',      require('./src/routes/orderRoutes'));
app.use('/api/inventory',   require('./src/routes/inventoryRoutes'));
app.use('/api/units',       require('./src/routes/unitRoutes'));

app.use('/api/reports',     require('./src/routes/reportRoutes'));
app.use('/api/settings',    require('./src/routes/settingRoutes'));
app.use('/api/suppliers',   require('./src/routes/supplierRoutes'));
app.use('/api/positions',   require('./src/routes/positionRoutes'));

/* 6) SPA-fallback для неизвестных путей */
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

/* 7) Запуск сервера */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌐 Server listening at http://localhost:${PORT}`));
