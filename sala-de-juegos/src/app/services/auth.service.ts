import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare var supabase: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private supabase: any; 

  public usuarioActual = signal<any | null>(null);

  public getClient() {
    return this.supabase;
  }

  constructor() {
    this.supabase = supabase.createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        storage: window.sessionStorage, 
        autoRefreshToken: true,
        persistSession: true
      }
    });

    this.supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) {
        this.usuarioActual.set(session.user);
      } else {
        this.usuarioActual.set(null);
      }
    });
  }

  async login(email: string, pass: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass
    });
    
    if (error) throw error;

    this.router.navigate(['/']);
    return data;
  }

  async registro(email: string, pass: string, nombre: string, apellido: string, edad: number): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: pass
      });

      if (error) {
        throw error;
      }

      if (!data?.user) {
        throw new Error('User already exists');
      }

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
      
      if (dbError) {
        throw dbError;
      }

      return data;

    } catch (error: any) {
      console.error('Error atrapado en el Servicio:', error);
      throw error;
    }
  }

  // LOGOUT
  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }
}