const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const Note = require("../models/noteModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");
const { createSchema, editSchema } = require("../util/noteValidationSchema");
const { NOTE_LIMIT, PAGINATION_LIMIT } = require("../constants/policies");

const getNotes = asyncHandler(async (req, res, next) => {
  const PAGE =
    parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 0;

  const notes = await Note.find({ user_id: req.user.id })
    .sort("-created_at")
    .select("-user_id")
    .skip(PAGE * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT);

  const response = {
    skip: PAGE * PAGINATION_LIMIT,
    limit: PAGINATION_LIMIT,
    total: await Note.find({ user_id: req.user.id }).count(),
    notes,
  };

  res.status(StatusCodes.OK).json(response);
});

const getAllNotes = asyncHandler(async (req, res, next) => {
  const notes = await Note.find({ user_id: req.user.id })
    .sort("-created_at")
    .select("-user_id");

  const response = {
    notes,
  };

  res.status(StatusCodes.OK).json(response);
});

const getNote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let note;

  try {
    note = await Note.findOne({ _id: id, user_id: req.user.id }).select(
      "-user_id"
    );
  } catch (error) {
    // for invalid mongodb objectId
    throw new ErrorResponse("Note not found", StatusCodes.NOT_FOUND);
  }

  if (!note) {
    throw new ErrorResponse("Note not found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(note);
});

const createNote = asyncHandler(async (req, res, next) => {
  const { error } = createSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const totalNotes = await Note.find({ user_id: req.user.id }).count();

  if (totalNotes === NOTE_LIMIT) {
    throw new ErrorResponse("Note limit reached", StatusCodes.FORBIDDEN);
  }

  const n = await Note.create({
    ...req.body,
    user_id: req.user.id,
  });

  const note = await Note.findById(n.id).select("-user_id");

  res.status(StatusCodes.CREATED).json(note);
});

const editNote = asyncHandler(async (req, res, next) => {
  const { error } = editSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const { id } = req.params;

  let note;

  try {
    note = await Note.findOne({ _id: id, user_id: req.user.id }).select(
      "-user_id"
    );
  } catch (error) {
    // for invalid mongodb objectId
    throw new ErrorResponse("Note not found", StatusCodes.NOT_FOUND);
  }

  if (!note) {
    throw new ErrorResponse("Note not found", StatusCodes.NOT_FOUND);
  }

  const { title, content } = req.body;

  note.title = title;
  note.content = content;

  note.save();

  res.status(StatusCodes.OK).json(note);
});

const deleteNote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const { deletedCount } = await Note.deleteOne({ _id: id });
    if (deletedCount !== 1)
      throw new ErrorResponse("Note not found", StatusCodes.NOT_FOUND);
  } catch (error) {
    throw new ErrorResponse("Note not found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({
    id: req.user.id,
  });
});

module.exports = {
  getNote,
  getNotes,
  getAllNotes,
  createNote,
  editNote,
  deleteNote,
};
