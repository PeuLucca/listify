// database.js
import * as SqlLite from "expo-sqlite";

// create databse
const db = SqlLite.openDatabase({ name: 'listify.db' });

export default db;
