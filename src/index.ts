import 'dotenv/config';
import express from 'express';

import locationRoutes from './routes/location';

const app: express.Express = express();

app.use('/location', locationRoutes);

app.listen(process.env.PORT ?? 3000);
