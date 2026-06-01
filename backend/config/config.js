const dbHost = import.meta.env.VITE_APP_DB_HOST;
const dbPort = import.meta.env.VITE_APP_DB_PORT;
const dbName = import.meta.env.VITE_APP_DB_NAME;
const dbUser = import.meta.env.VITE_APP_DB_USER;
const dbPass = import.meta.env.VITE_APP_DB_PASS;

const dbConfig = {
    host: dbHost,
    port: dbPort,
    name: dbName,
    user: dbUser,
    pass: dbPass,
};

export default dbConfig;