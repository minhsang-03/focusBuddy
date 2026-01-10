import { MongoClient, ObjectId } from 'mongodb';
import { DB_URI } from '$env/static/private';

const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db('FocusBuddy');

function normalize(doc) {
  if (!doc) return null;
  return { ...doc, _id: doc._id.toString() };
}

// Tags
export async function getTags() {
  const docs = await db.collection('tags').find({}).toArray();
  return docs.map(normalize).filter(Boolean);
}

export async function getTag(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection('tags').findOne({ _id: new ObjectId(id) });
  return normalize(doc);
}

export async function createTag(data) {
  const doc = { name: data.name || '', createdAt: new Date() };
  const result = await db.collection('tags').insertOne(doc);
  return result.insertedId.toString();
}

// Users
export async function getUsers() {
  const docs = await db.collection('users').find({}).toArray();
  return docs.map(normalize).filter(Boolean);
}

export async function getUser(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection('users').findOne({ _id: new ObjectId(id) });
  return normalize(doc);
}

export async function getUserByEmail(email) {
  const doc = await db.collection('users').findOne({ email });
  return normalize(doc);
}

export async function createUser(data) {
  const doc = {
    username: data.username || '',
    name: data.username || '',
    email: data.email || '',
    passwordHash: data.passwordHash || '',
    createdAt: new Date(),
  };
  const result = await db.collection('users').insertOne(doc);
  return result.insertedId.toString();
}

export async function updateUser(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const data = { ...obj };
  delete data._id;
  delete data.id;
  const result = await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

export async function deleteUser(id) {
  if (!ObjectId.isValid(id)) return null;
  const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// Todos
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
  const docs = await db.collection('todos').find({}).toArray();
  return docs.map(normalizeTodo).filter(Boolean);
}

export async function getTodo(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection('todos').findOne({ _id: new ObjectId(id) });
  return normalizeTodo(doc);
}

export async function createTodo(data) {
  const doc = {
    title: data.title || data.text || '',
    description: data.description || '',
    priority: data.priority || 'medium',
    completed: !!data.completed,
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    createdAt: new Date(),
  };
  const result = await db.collection('todos').insertOne(doc);
  return result.insertedId.toString();
}

export async function updateTodo(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const data = { ...obj };
  delete data._id;
  delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  const result = await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

export async function deleteTodo(id) {
  if (!ObjectId.isValid(id)) return null;
  const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// Activities
function normalizeActivity(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    tags: Array.isArray(doc.tags) ? doc.tags.map(tag => tag?.toString()) : [],
    startTime: doc.startTime ? new Date(doc.startTime) : undefined,
    endTime: doc.endTime ? new Date(doc.endTime) : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
  };
}

export async function getActivities() {
  const docs = await db.collection('activities').find({}).toArray();
  return docs.map(normalizeActivity).filter(Boolean);
}

export async function getActivity(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection('activities').findOne({ _id: new ObjectId(id) });
  return normalizeActivity(doc);
}

export async function createActivity(data) {
  const doc = {
    title: data.title || '',
    description: data.description || '',
    tags: Array.isArray(data.tags)
      ? data.tags.map(id => ObjectId.isValid(id) ? new ObjectId(id) : null).filter(Boolean)
      : [],
    method: data.method || '',
    durationSeconds: data.durationSeconds || 0,
    startTime: data.startTime ? new Date(data.startTime) : undefined,
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    createdAt: new Date(),
  };
  const result = await db.collection('activities').insertOne(doc);
  return result.insertedId.toString();
}

export async function updateActivity(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const data = { ...obj };
  delete data._id;
  delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  if (data.startTime) data.startTime = new Date(data.startTime);
  if (data.endTime) data.endTime = new Date(data.endTime);
  const result = await db.collection('activities').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

export async function deleteActivity(id) {
  if (!ObjectId.isValid(id)) return null;
  const result = await db.collection('activities').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

export async function getAllTags() {
  const docs = await db.collection('activities').find({}).toArray();
  const tagsSet = new Set();
  docs.forEach(doc => {
    if (doc.tags && Array.isArray(doc.tags)) {
      doc.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
}

// LearningMethods
export async function getLearningMethods() {
  const docs = await db.collection('learningMethods').find({}).toArray();
  return docs.map(normalize).filter(Boolean);
}

export async function getLearningMethod(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection('learningMethods').findOne({ _id: new ObjectId(id) });
  return normalize(doc);
}

export async function createLearningMethod(data) {
  const doc = {
    name: data.name || '',
    description: data.description || '',
    defaultWorkMinutes: data.defaultWorkMinutes || 0,
    defaultBreakMinutes: data.defaultBreakMinutes || 0,
  };
  const result = await db.collection('learningMethods').insertOne(doc);
  return result.insertedId.toString();
}

export async function updateLearningMethod(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const data = { ...obj };
  delete data._id;
  delete data.id;
  const result = await db.collection('learningMethods').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

export async function deleteLearningMethod(id) {
  if (!ObjectId.isValid(id)) return null;
  const result = await db.collection('learningMethods').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// JournalEntries
function normalizeJournalEntry(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
  };
}

export async function getJournalEntries() {
  const docs = await db.collection('journalEntries').find({}).toArray();
  return docs.map(normalizeJournalEntry).filter(Boolean);
}

export async function getJournalEntry(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection('journalEntries').findOne({ _id: new ObjectId(id) });
  return normalizeJournalEntry(doc);
}

export async function createJournalEntry(data) {
  const doc = {
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    title: data.title || '',
    content: data.content || '',
    mood: data.mood || '',
    createdAt: new Date(),
  };
  const result = await db.collection('journalEntries').insertOne(doc);
  return result.insertedId.toString();
}

export async function updateJournalEntry(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const data = { ...obj };
  delete data._id;
  delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  const result = await db.collection('journalEntries').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

export async function deleteJournalEntry(id) {
  if (!ObjectId.isValid(id)) return null;
  const result = await db.collection('journalEntries').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}

// Habits
function normalizeHabit(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : undefined,
    lastCompleted: doc.lastCompleted ? new Date(doc.lastCompleted) : undefined,
  };
}

export async function getHabits() {
  const docs = await db.collection('habits').find({}).toArray();
  return docs.map(normalizeHabit).filter(Boolean);
}

export async function getHabit(id) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection('habits').findOne({ _id: new ObjectId(id) });
  return normalizeHabit(doc);
}

export async function createHabit(data) {
  const doc = {
    userId: data.userId && ObjectId.isValid(data.userId) ? new ObjectId(data.userId) : undefined,
    name: data.name || '',
    streak: typeof data.streak === 'number' ? data.streak : 0,
    lastCompleted: data.lastCompleted ? new Date(data.lastCompleted) : undefined,
    history: Array.isArray(data.history) ? data.history : [],
  };
  const result = await db.collection('habits').insertOne(doc);
  return result.insertedId.toString();
}

export async function updateHabit(obj) {
  const id = obj._id || obj.id;
  if (!id || !ObjectId.isValid(id)) return null;
  const data = { ...obj };
  delete data._id;
  delete data.id;
  if (data.userId && ObjectId.isValid(data.userId)) data.userId = new ObjectId(data.userId);
  if (data.lastCompleted) data.lastCompleted = new Date(data.lastCompleted);
  const result = await db.collection('habits').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount ? id : null;
}

export async function deleteHabit(id) {
  if (!ObjectId.isValid(id)) return null;
  const result = await db.collection('habits').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? id : null;
}
