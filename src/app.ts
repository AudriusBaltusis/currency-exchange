import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import { CurrenciesController } from "./api/currencies/currencies.controller";
import { Container } from 'typedi';
import { EnvDev } from './env/env.dev'

useContainer(Container);
 
const app = createExpressServer({
   controllers: [CurrenciesController]
});
 
app.listen(EnvDev.SERVER_PORT);
