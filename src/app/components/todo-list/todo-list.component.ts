import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../../services/todo.service';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Partial<Todo> = { text: '', category: '', tags: [] };
  tagsInput: string = '';
  completionRate: number = 0;

  constructor(private todoService: TodoService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(
      (data: Todo[]) => {
        this.todos = data;
        this.calculateCompletionRate();
      },
      err => {
        console.error(err);
      }
    );
  }

  calculateCompletionRate() {
    if (this.todos.length === 0) {
      this.completionRate = 0;
    } else {
      const completedTodos = this.todos.filter(todo => todo.completed).length;
      this.completionRate = (completedTodos / this.todos.length) * 100;
    }
  }

  addTodo() {
    if (this.newTodo.text?.trim()) {
      const todoToCreate: Partial<Todo> = {
        ...this.newTodo,
        tags: this.tagsInput.split(',').map(tag => tag.trim())  // tagsInput'ı diziye dönüştürüyoruz
      };

      this.todoService.createTodo(todoToCreate).subscribe(
        () => {
          this.newTodo = { text: '', category: '', tags: [] };
          this.tagsInput = '';
          this.loadTodos();
          this.notificationService.showSuccess('Todo created successfully', 'Success');
        },
        err => {
          console.error(err);
          this.notificationService.showError('Failed to create todo', 'Error');
        }
      );
    }
  }

  updateTodo(todo: Todo) {
    const updatedTodo: Partial<Todo> = {
      text: todo.text,
      category: todo.category,
      tags: todo.tags
    };

    this.todoService.updateTodo(todo.id, updatedTodo).subscribe(
      () => {
        this.loadTodos();
        this.notificationService.showSuccess('Todo updated successfully', 'Success');
      },
      err => {
        console.error(err);
        this.notificationService.showError('Failed to update todo', 'Error');
      }
    );
  }
}
