// noteController.js

const { Note } = require("../models");

const createNote = async (req, res) => {
  try {
    const { note, commentaire, clientId, courtierId, date } = req.body;
    const newNote = await Note.create({
      note,
      commentaire,
      clientId,
      courtierId,
      date,
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating Note:", error);
    res.status(500).json({ error: "An error occurred while creating Note." });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error retrieving Notes:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Notes." });
  }
};

const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("Error retrieving Note by ID:", error);
    res.status(500).json({ error: "An error occurred while retrieving Note." });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { note, commentaire, date } = req.body;
  try {
    let updatedNote = await Note.findByPk(id);
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found." });
    }
    updatedNote = await updatedNote.update({
      note,
      commentaire,
      date,
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating Note:", error);
    res.status(500).json({ error: "An error occurred while updating Note." });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }
    await note.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting Note:", error);
    res.status(500).json({ error: "An error occurred while deleting Note." });
  }
};

const getNotesByCourtierId = async (req, res) => {
  const { courtierId } = req.params;
  try {
    const notes = await Note.findAll({ where: { courtierId } });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error retrieving Notes by Courtier ID:", error);
    res.status(500).json({
      error: "An error occurred while retrieving Notes by Courtier ID.",
    });
  }
};

const getAverageNoteForCourtier = async (req, res) => {
  const { courtierId } = req.params;
  try {
    const averageNote = await Note.findAll({
      attributes: [[sequelize.fn("AVG", sequelize.col("note")), "averageNote"]],
      where: { courtierId },
    });
    res.status(200).json(averageNote[0]);
  } catch (error) {
    console.error("Error retrieving Average Note for Courtier:", error);
    res.status(500).json({
      error: "An error occurred while retrieving Average Note for Courtier.",
    });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNotesByCourtierId,
  getAverageNoteForCourtier,
};
