import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TodoService, Todo } from '../../services/todo.service';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() todoUpdated = new EventEmitter();
  @Output() todoDeleted = new EventEmitter();

  tagsInput: string = '';

  constructor(private todoService: TodoService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.tagsInput = this.todo.tags?.join(', ') || '';
  }

  toggleComplete() {
    const updatedTodo: Partial<Todo> = { ...this.todo, completed: !this.todo.completed };
    this.todoService.updateTodo(this.todo.id, updatedTodo).subscribe(
      () => this.todoUpdated.emit(),
      err => console.error(err)
    );
  }

  updateTodo() {
    const updatedTodo: Partial<Todo> = {
      ...this.todo,
      tags: this.tagsInput.split(',').map(tag => tag.trim())
    };

    this.todoService.updateTodo(this.todo.id, updatedTodo).subscribe(
      () => {
        this.todoUpdated.emit();
        this.notificationService.showSuccess('Todo updated successfully', 'Success');
      },
      err => {
        console.error(err);
        this.notificationService.showError('Failed to update todo', 'Error');
      }
    );
  }

  deleteTodo() {
    this.todoService.deleteTodo(this.todo.id).subscribe(
      () => this.todoDeleted.emit(),
      err => console.error(err)
    );
  }
}
