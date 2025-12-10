import { MongoClient, ObjectId } from 'mongodb';
import { DB_URI } from '$env/static/private';
import { get } from "svelte/store";

// Minimal, focused DB module to work with Users documents of the shape:
// { _id: ObjectId, username, email, passwordHash, createdAt }
// Exposes: getUsers, getUser, createUser, updateUser, deleteUser

const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db('FocusBuddy');

/** @param {{_id:any}|null} doc */
function normalizeUser(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

/** Get all users

 */
export async function getUsers() {
  const collection = db.collection('users');
  const docs = await collection.find({}).toArray();
  const users = docs.map(normalizeUser).filter((u) => u !== null);
  return /** @type {object[]} */ (users);
}

/** Get one user by id
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getUser(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('users');
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return normalizeUser(doc);
}

/** Get user by email
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export async function getUserByEmail(email) {
  const collection = db.collection('users');
  const doc = await collection.findOne({ email });
  return normalizeUser(doc);
}

/** Create a new user
 * @param {{username:string,email:string,passwordHash:string}} data
 * @returns {Promise<string>} inserted id
 */
export async function createUser(data) {
  const collection = db.collection('users');
  const doc = {
    username: data.username || '',
    email: data.email || '',
    passwordHash: data.passwordHash || '',
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

/** Update an existing user. Provide object with _id or id and fields to update.
 * @param {{_id?:string,id?:string, [k:string]:any}} obj
 * @returns {Promise<string|null>} id if updated
 */
export async function updateUser(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const collection = db.collection('users');
  const data = { ...obj };
  delete data._id;
  delete data.id;
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

/** Delete a user by id
 * @param {string} id
 * @returns {Promise<string|null>}
 */
export async function deleteUser(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('users');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// default export keeps old-style default import compatibility
// note: full default export is defined at the end of the file

// -----------------------------
// Todos
// -----------------------------

/** Normalize todo document */
/** @param {any} doc */
function normalizeTodo(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    dueDate: doc.dueDate ? new Date(doc.dueDate) : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
  };
}

export async function getTodos() {
  const collection = db.collection('todos');
  const docs = await collection.find({}).toArray();
  const todos = docs.map(normalizeTodo).filter((t) => t !== null);
  return /** @type {object[]} */ (todos);
}

/** Get single todo by id
 * @param {string} id
 */
export async function getTodo(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('todos');
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return normalizeTodo(doc);
}

/** Create todo
 * @param {any} data
 */
export async function createTodo(data) {
  const collection = db.collection('todos');
  const doc = {
    text: data.text || '',
    priority: data.priority || 'normal',
    completed: !!data.completed,
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

/** Update todo
 * @param {any} obj
 */
export async function updateTodo(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const collection = db.collection('todos');
  const data = { ...obj };
  delete data._id; delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

/** Delete todo
 * @param {string} id
 */
export async function deleteTodo(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('todos');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// -----------------------------
// Activities
// -----------------------------

/** @param {any} doc */
function normalizeActivity(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    startTime: doc.startTime ? new Date(doc.startTime) : undefined,
    endTime: doc.endTime ? new Date(doc.endTime) : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
  };
}

export async function getActivities() {
  const collection = db.collection('activities');
  const docs = await collection.find({}).toArray();
  const items = docs.map(normalizeActivity).filter((i) => i !== null);
  return /** @type {object[]} */ (items);
}

/** Get activity by id
 * @param {string} id
 */
export async function getActivity(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('activities');
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return normalizeActivity(doc);
}

/** Create activity
 * @param {any} data
 */
export async function createActivity(data) {
  const collection = db.collection('activities');
  const doc = {
    title: data.title || '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    method: data.method || '',
    durationSeconds: data.durationSeconds || 0,
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

/** Update activity
 * @param {any} obj
 */
export async function updateActivity(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const collection = db.collection('activities');
  const data = { ...obj };
  delete data._id; delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  if (data.startTime) data.startTime = new Date(data.startTime);
  if (data.endTime) data.endTime = new Date(data.endTime);
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

/** Delete activity
 * @param {string} id
 */
export async function deleteActivity(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('activities');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// -----------------------------
// LearningMethods
// -----------------------------

/** @param {any} doc */
function normalizeLearningMethod(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

/** Get learning methods */
export async function getLearningMethods() {
  const collection = db.collection('learningMethods');
  const docs = await collection.find({}).toArray();
  const items = docs.map(normalizeLearningMethod).filter((i) => i !== null);
  return /** @type {object[]} */ (items);
}

/** Get learning method
 * @param {string} id
 */
export async function getLearningMethod(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('learningMethods');
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return normalizeLearningMethod(doc);
}

/** Create learning method
 * @param {any} data
 */
export async function createLearningMethod(data) {
  const collection = db.collection('learningMethods');
  const doc = {
    name: data.name || '',
    description: data.description || '',
    defaultWorkMinutes: data.defaultWorkMinutes || 0,
    defaultBreakMinutes: data.defaultBreakMinutes || 0,
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

/** Update learning method
 * @param {any} obj
 */
export async function updateLearningMethod(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const collection = db.collection('learningMethods');
  const data = { ...obj };
  delete data._id; delete data.id;
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

/** Delete learning method
 * @param {string} id
 */
export async function deleteLearningMethod(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('learningMethods');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// -----------------------------
// JournalEntries
// -----------------------------

/** @param {any} doc */
function normalizeJournalEntry(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
  };
}

/** Get all journal entries */
export async function getJournalEntries() {
  const collection = db.collection('journalEntries');
  const docs = await collection.find({}).toArray();
  const items = docs.map(normalizeJournalEntry).filter((i) => i !== null);
  return /** @type {object[]} */ (items);
}

/** Get journal entry
 * @param {string} id
 */
export async function getJournalEntry(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('journalEntries');
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return normalizeJournalEntry(doc);
}

/** Create journal entry
 * @param {any} data
 */
export async function createJournalEntry(data) {
  const collection = db.collection('journalEntries');
  const doc = {
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    title: data.title || '',
    content: data.content || '',
    mood: data.mood || '',
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

/** Update journal entry
 * @param {any} obj
 */
export async function updateJournalEntry(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const collection = db.collection('journalEntries');
  const data = { ...obj };
  delete data._id; delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

/** Delete journal entry
 * @param {string} id
 */
export async function deleteJournalEntry(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('journalEntries');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// -----------------------------
// Habits
// -----------------------------

/** @param {any} doc */
function normalizeHabit(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    lastCompleted: doc.lastCompleted ? new Date(doc.lastCompleted) : undefined,
  };
}

/** Get habits */
export async function getHabits() {
  const collection = db.collection('habits');
  const docs = await collection.find({}).toArray();
  const items = docs.map(normalizeHabit).filter((i) => i !== null);
  return /** @type {object[]} */ (items);
}

/** Get habit
 * @param {string} id
 */
export async function getHabit(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('habits');
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return normalizeHabit(doc);
}

/** Create habit
 * @param {any} data
 */
export async function createHabit(data) {
  const collection = db.collection('habits');
  const doc = {
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    name: data.name || '',
    streak: typeof data.streak === 'number' ? data.streak : 0,
    lastCompleted: data.lastCompleted ? new Date(data.lastCompleted) : undefined,
    history: Array.isArray(data.history) ? data.history : [],
  };
  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

/** Update habit
 * @param {any} obj
 */
export async function updateHabit(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const collection = db.collection('habits');
  const data = { ...obj };
  delete data._id; delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  if (data.lastCompleted) data.lastCompleted = new Date(data.lastCompleted);
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

/** Delete habit
 * @param {string} id
 */
export async function deleteHabit(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = db.collection('habits');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// update default export to include new functions
export default {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getLearningMethods,
  getLearningMethod,
  createLearningMethod,
  updateLearningMethod,
  deleteLearningMethod,
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
};
