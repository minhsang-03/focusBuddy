import { getTodos, createTodo, updateTodo, deleteTodo } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const parentData = await parent();
  const user = parentData.user;
  const allTodos = await getTodos();
  const todos = allTodos.filter(t => t.userId === user?._id);
  return { todos, user };
}

/** @type {import('./$types').Actions} */
export const actions = {
  create: async ({ request, cookies }) => {
    const userId = cookies.get('userId');
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description') || '';
    const priority = formData.get('priority') || 'medium';
    const dueDate = formData.get('dueDate');

    if (!title) {
      return { success: false, error: 'Titel ist erforderlich' };
    }

    try {
      await createTodo({ 
        title, 
        description, 
        priority, 
        completed: false, 
        dueDate: dueDate ? new Date(dueDate) : null, 
        userId 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Erstellen der Aufgabe' };
    }
  },

  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const description = formData.get('description') || '';
    const priority = formData.get('priority') || 'medium';
    const dueDate = formData.get('dueDate');

    if (!title) {
      return { success: false, error: 'Titel ist erforderlich' };
    }

    try {
      await updateTodo({ 
        _id: id, 
        title, 
        description, 
        priority, 
        dueDate: dueDate ? new Date(dueDate) : null 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Aktualisieren' };
    }
  },

  toggle: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const completed = formData.get('completed') === 'true';

    try {
      await updateTodo({ _id: id, completed: !completed });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Aktualisieren' };
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    try {
      await deleteTodo(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Fehler beim Löschen' };
    }
  }
};
