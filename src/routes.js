import { randomUUID } from 'node:crypto'
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      }: null)
      return res.writeHead(200).end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description, 
        completed_at: null, 
        created_at: new Date(), 
        updated_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete('tasks', id)
      return res.writeHead(204).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      database.update('tasks', id, { title, description });
      
      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/completed'),
    handler: (req, res) => {
      const { id } = req.params;

      database.updateCompletedTask('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/csv'),
    handler: (req, res) => {
      
    }
  }
]