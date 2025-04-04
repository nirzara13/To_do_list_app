/**
 * Tests unitaires pour les fonctions de tri et de filtrage de TasksPage
 */

// Fonction de tri extraite du composant TasksPage
const sortTasks = (tasksToSort, sortOption, sortDirection) => {
    return [...tasksToSort].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortOption) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'due_date':
          valueA = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
          valueB = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case 'priority':
          const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
          valueA = priorityValues[a.priority] || 0;
          valueB = priorityValues[b.priority] || 0;
          break;
        case 'status':
          const statusValues = { 'todo': 1, 'in_progress': 2, 'completed': 3 };
          valueA = statusValues[a.status] || 0;
          valueB = statusValues[b.status] || 0;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
        default:
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
          break;
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };
  
  // Fonction de filtrage extraite du composant TasksPage
  const filterTasks = (tasks, filters) => {
    let filteredTasks = [...tasks];
    
    if (filters.list) {
      filteredTasks = filteredTasks.filter(task => {
        if (filters.list === 'null' || filters.list === '') {
          return task.list_id === null;
        }
        return task.list_id === Number(filters.list);
      });
    }
    
    if (filters.category && filters.category !== '') {
      filteredTasks = filteredTasks.filter(task => 
        task.categories && 
        task.categories.some(cat => String(cat.id) === String(filters.category))
      );
    }
    
    if (filters.status && filters.status !== '') {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    if (filters.priority && filters.priority !== '') {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }
    
    return filteredTasks;
  };
  
  describe('TasksPage - Fonctions de tri', () => {
    const mockTasks = [
      {
        id: 1,
        title: 'C Task',
        description: 'Description 1',
        status: 'todo',
        priority: 'high',
        due_date: '2025-03-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      },
      {
        id: 2,
        title: 'A Task',
        description: 'Description 2',
        status: 'in_progress',
        priority: 'medium',
        due_date: '2025-01-01',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-04T00:00:00Z'
      },
      {
        id: 3,
        title: 'B Task',
        description: 'Description 3',
        status: 'completed',
        priority: 'low',
        due_date: '2025-02-01',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-06T00:00:00Z'
      }
    ];
  
    test('Tri par titre en ordre ascendant', () => {
      const sorted = sortTasks(mockTasks, 'title', 'asc');
      expect(sorted[0].title).toBe('A Task');
      expect(sorted[1].title).toBe('B Task');
      expect(sorted[2].title).toBe('C Task');
    });
  
    test('Tri par titre en ordre descendant', () => {
      const sorted = sortTasks(mockTasks, 'title', 'desc');
      expect(sorted[0].title).toBe('C Task');
      expect(sorted[1].title).toBe('B Task');
      expect(sorted[2].title).toBe('A Task');
    });
  
    test('Tri par date d\'échéance', () => {
      const sorted = sortTasks(mockTasks, 'due_date', 'asc');
      expect(sorted[0].id).toBe(2); // 2025-01-01
      expect(sorted[1].id).toBe(3); // 2025-02-01
      expect(sorted[2].id).toBe(1); // 2025-03-01
    });
  
    test('Tri par priorité', () => {
      const sorted = sortTasks(mockTasks, 'priority', 'desc');
      expect(sorted[0].priority).toBe('high');
      expect(sorted[1].priority).toBe('medium');
      expect(sorted[2].priority).toBe('low');
    });
  
    test('Tri par statut', () => {
      const sorted = sortTasks(mockTasks, 'status', 'asc');
      expect(sorted[0].status).toBe('todo');
      expect(sorted[1].status).toBe('in_progress');
      expect(sorted[2].status).toBe('completed');
    });
  });
  
  describe('TasksPage - Fonctions de filtrage', () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        status: 'todo',
        priority: 'high',
        list_id: 1,
        categories: [{ id: 1, name: 'Work' }]
      },
      {
        id: 2,
        title: 'Task 2',
        status: 'in_progress',
        priority: 'medium',
        list_id: 2,
        categories: [{ id: 2, name: 'Personal' }]
      },
      {
        id: 3,
        title: 'Task 3',
        status: 'completed',
        priority: 'low',
        list_id: null,
        categories: []
      }
    ];
  
    test('Filtrage par liste', () => {
      const filtered = filterTasks(mockTasks, { list: '1' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(1);
    });
  
    test('Filtrage des tâches sans liste', () => {
      const filtered = filterTasks(mockTasks, { list: 'null' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(3);
    });
  
    test('Filtrage par catégorie', () => {
      const filtered = filterTasks(mockTasks, { category: '2' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(2);
    });
  
    test('Filtrage par statut', () => {
      const filtered = filterTasks(mockTasks, { status: 'completed' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(3);
    });
  
    test('Filtrage par priorité', () => {
      const filtered = filterTasks(mockTasks, { priority: 'high' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(1);
    });
  
    test('Filtrage avec plusieurs critères', () => {
      const filtered = filterTasks(mockTasks, { 
        status: 'in_progress', 
        priority: 'medium' 
      });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(2);
    });
  });