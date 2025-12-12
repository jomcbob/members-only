const { addMessage, dbGetMessageById, dbDeleteMessageById } = require("../db/queries")

function renderMessageGet(req, res) {
  res.render("newMessage", { title: "New Message"})
}

async function renderDeleteMessageGet(req, res) {
    const id = Number(req.params.id)
    const post = await dbGetMessageById(id)
    res.render("delete", { post })
}

async function addPostPost(req, res) {
  await addMessage(req.body.message, req.body.title, req.body.username)
  res.redirect("/")
}

async function showMessageByIdGet(req, res) {
    const id = Number(req.params.id)
    const post = await dbGetMessageById(id)
    res.render('message', { post })
}

async function deletePostGet(req, res) {
  try {
    const id = Number(req.params.id)
        console.log("Deleting message with id:", id);
    if (isNaN(id)) {
      return res.status(400).send("Invalid ID")
    }

    const post = await dbGetMessageById(id)
    await dbDeleteMessageById(id)

    if (!post) {
      return res.status(404).send("Message not found")
    }

    res.redirect("/")
  } catch (err) {
    console.error("deletePostGet error:", err)
    res.status(500).send("Server error")
  }
}


module.exports = {
  renderMessageGet,
  addPostPost,
  showMessageByIdGet,
  renderDeleteMessageGet,
  deletePostGet,
}