import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Calendar, Clock, Tag, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

// Mock tasks data
const initialTasks = {
  todo: [
    {
      id: '1',
      title: 'Design new dashboard',
      description: 'Create wireframes and mockups',
      priority: 'high',
      dueDate: '2024-03-25',
      assignee: {
        name: 'John Smith',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      labels: ['Design', 'UI/UX'],
      comments: 3,
      attachments: 2
    },
    {
      id: '2',
      title: 'Update documentation',
      description: 'Update API docs',
      priority: 'medium',
      dueDate: '2024-03-28',
      assignee: {
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      labels: ['Documentation'],
      comments: 1
    }
  ],
  inProgress: [
    {
      id: '3',
      title: 'Implement authentication',
      description: 'Add JWT auth',
      priority: 'high',
      dueDate: '2024-03-20',
      assignee: {
        name: 'Michael Brown',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      labels: ['Backend', 'Security'],
      comments: 5,
      attachments: 1
    }
  ],
  review: [
    {
      id: '4',
      title: 'Fix navigation bug',
      description: 'Mobile nav issues',
      priority: 'high',
      dueDate: '2024-03-18',
      assignee: {
        name: 'Emily Wilson',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      labels: ['Bug', 'Frontend'],
      comments: 2
    }
  ],
  done: [
    {
      id: '5',
      title: 'Setup CI/CD',
      description: 'Configure GitHub Actions',
      priority: 'medium',
      dueDate: '2024-03-15',
      assignee: {
        name: 'David Lee',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      labels: ['DevOps'],
      comments: 4,
      attachments: 3
    }
  ]
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-danger-100 text-danger-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      'Design': 'bg-purple-100 text-purple-800',
      'UI/UX': 'bg-indigo-100 text-indigo-800',
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Security': 'bg-red-100 text-red-800',
      'Documentation': 'bg-pink-100 text-pink-800',
      'Bug': 'bg-orange-100 text-orange-800',
      'DevOps': 'bg-cyan-100 text-cyan-800'
    };
    return colors[label] || 'bg-neutral-100 text-neutral-800';
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // Dropped outside any list
    if (!destination) return;

    // Same list, same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Get source and destination lists
    const sourceList = [...tasks[source.droppableId as keyof typeof tasks]];
    const destList = source.droppableId === destination.droppableId
      ? sourceList
      : [...tasks[destination.droppableId as keyof typeof tasks]];

    // Remove from source list
    const [removed] = sourceList.splice(source.index, 1);

    // Add to destination list
    destList.splice(destination.index, 0, removed);

    // Update state
    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: source.droppableId === destination.droppableId
        ? sourceList
        : destList
    });
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-neutral-100' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-primary-100' },
    { id: 'review', title: 'Review', color: 'bg-warning-100' },
    { id: 'done', title: 'Done', color: 'bg-success-100' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Task Board</h1>
          <p className="text-neutral-500">Manage and track project tasks</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/tasks/create" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Create Task
          </Link>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <div className={`p-3 rounded-t-lg ${column.color}`}>
                <h2 className="text-sm font-medium">
                  {column.title}{' '}
                  <span className="text-neutral-500">
                    ({tasks[column.id as keyof typeof tasks].length})
                  </span>
                </h2>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 bg-white rounded-b-lg shadow-sm border border-neutral-200 p-4 min-h-[calc(100vh-16rem)] overflow-y-auto"
                  >
                    <div className="space-y-3">
                      {tasks[column.id as keyof typeof tasks].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-sm font-medium text-neutral-900">
                                  {task.title}
                                </h3>
                                <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>

                              <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
                                {task.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {task.labels.map((label, i) => (
                                  <span
                                    key={i}
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLabelColor(label)}`}
                                  >
                                    <Tag size={10} className="mr-1" />
                                    {label}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <img
                                    src={task.assignee.avatar}
                                    alt={task.assignee.name}
                                    className="h-6 w-6 rounded-full"
                                  />
                                  <span className="ml-2 text-xs text-neutral-500">
                                    {task.assignee.name}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-3 text-neutral-500">
                                  {task.comments && (
                                    <div className="flex items-center text-xs">
                                      <MessageSquare size={12} className="mr-1" />
                                      {task.comments}
                                    </div>
                                  )}
                                  {task.attachments && (
                                    <div className="flex items-center text-xs">
                                      <Paperclip size={12} className="mr-1" />
                                      {task.attachments}
                                    </div>
                                  )}
                                  <div className="flex items-center text-xs">
                                    <Calendar size={12} className="mr-1" />
                                    {format(new Date(task.dueDate), 'MMM dd')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;