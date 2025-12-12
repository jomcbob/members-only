const pool = require("./pool")
require("dotenv").config()

async function main() {
  console.log("seeding users...")

  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        ismember BOOLEAN DEFAULT FALSE,
        isadmin BOOLEAN DEFAULT FALSE
      )
    `)

    await client.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`)

    console.log("users table made!")
  } finally {
    client.release()
  }
}

async function messages() {
  console.log("seeding messages...")

  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        username TEXT REFERENCES users(username) ON DELETE SET NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`TRUNCATE TABLE messages RESTART IDENTITY CASCADE`)

    console.log("messages table made!")
  } finally {
    client.release()
  }
}

(async () => {
  try {
    await main()
    await messages()
  } catch (err) {
    console.error(err)
  } finally {
    await pool.end()
    process.exit(0)
  }
})()
