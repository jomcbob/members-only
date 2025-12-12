const pool = require("./pool");

async function addUser(username, password, firstname, lastname) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO users (username, password, firstname, lastname, ismember, isadmin)
       VALUES ($1, $2, $3, $4, FALSE, FALSE)`,
       [username, password, firstname, lastname]
    );
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("Username is already taken");
    }
    throw err;
  } finally {
    client.release();
  }
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

async function makeAdmin(userId) {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE users
       SET isadmin = TRUE,
           ismember = TRUE
       WHERE id = $1`,
      [userId]
    );
  } finally {
    client.release();
  }
}

async function makeMember(userId) {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE users
       SET ismember = TRUE
       WHERE id = $1`,
      [userId]
    );
  } finally {
    client.release();
  }
}

module.exports = {
  addUser,
  addMessage,
  getMessages,
  dbGetMessageById,
  dbDeleteMessageById,
  makeAdmin,
  makeMember,
};