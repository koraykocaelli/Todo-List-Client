import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category?: string;
  tags?: string[]; 
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    const token = localStorage.getItem('jwt_token');  // Token'i localStorage'dan alın
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.baseUrl}/todos`, this.getHttpOptions());
  }

  createTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(`${this.baseUrl}/todos`, todo, this.getHttpOptions());
  }

  updateTodo(todoId: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/todos/${todoId}`, todo, this.getHttpOptions());
  }

  deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/todos/${todoId}`, this.getHttpOptions());
  }

  shareTodoWithUser(todoId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/todos/${todoId}/share`, { userId }, this.getHttpOptions());
  }

  addCommentToTodo(todoId: number, comment: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/todos/${todoId}/comments`, { comment }, this.getHttpOptions());
  }

  getCommentsForTodo(todoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/todos/${todoId}/comments`, this.getHttpOptions());
  }
}
