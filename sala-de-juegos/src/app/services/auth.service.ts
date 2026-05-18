import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';


declare var supabase: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: any; 
  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser$: Observable<any | null>;

  constructor(private router: Router) {
    // Usamos el constructor global del script del index
    this.supabase = supabase.createClient(environment.supabaseUrl, environment.supabaseKey);
    this.currentUserSubject = new BehaviorSubject<any | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) {
        this.currentUserSubject.next(session.user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  async login(email: string, pass: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass
    });
    if (error) throw error;
    return data;
  }

  async registro(email: string, pass: string, nombre: string, apellido: string, edad: number): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: pass
    });

    if (error) throw error;

    if (data.user) {
      const { error: dbError } = await this.supabase
        .from('usuarios')
        .insert([
          { 
            id: data.user.id, 
            nombre: nombre, 
            apellido: apellido, 
            edad: edad, 
            email: email 
          }
        ]);
      
      if (dbError) throw dbError;
    }
    return data;
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }
}