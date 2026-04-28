import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { seedDatabase } from "./services/seedService.js";

async function start() {
  await connectDatabase();
  await seedDatabase();

  app.listen(env.port, () => {
    console.log(`Digital HealthCare API running at http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start Digital HealthCare API", error);
  process.exit(1);
});
