const pool = require("./pool");

async function addUser(username, password, firstname, lastname) {
  const client = await pool.connect();

  await client.query(
    `INSERT INTO users (username, password, firstname, lastname, isMember, isAdmin)
     VALUES ($1, $2, $3, $4, FALSE, FALSE)`,
    [username, password, firstname, lastname]
  );

    client.release();
}

async function addMessage(message, title, username) {
  const client = await pool.connect();

  await client.query(
    `INSERT INTO messages (message, title, username)
     VALUES ($1, $2, $3)`,
    [message, title, username]
  );

    client.release();
}

async function getMessages() {
  const client = await pool.connect();

    const { rows } = await client.query(
    `SELECT * FROM messages ORDER BY date ASC`
  );

    client.release();
    return rows
}

async function dbGetMessageById(id) {
  try {
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [id]);
    return result.rows[0] || null; 
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function dbDeleteMessageById(id) {
  const client = await pool.connect();

  await client.query(
    `DELETE FROM messages WHERE id = $1`,[id]
  );
    client.release();
}

module.exports = {
  addUser,
  addMessage,
  getMessages,
  dbGetMessageById,
  dbDeleteMessageById,
};