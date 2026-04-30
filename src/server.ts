import app from "@/app";
import { ENV } from "@/config/env";

const startServer = () => {
  try {
    app.listen(ENV.PORT, () => {
      console.log("-------------------------------------------")
      console.log(`Server is running on port ${ENV.PORT}`)
      console.log(`Backend URL: ${ENV.BACKEND_URL}`)
      console.log(`Environment: ${ENV.NODE_ENV}`)
      console.log("-------------------------------------------")
    });

  } catch(error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();