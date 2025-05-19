import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { API_URL } from '../config/config';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchUrl = API_URL + 'products/real-time-search'; // URL to your search endpoint
  private searchTerms = new Subject<string>();
  
  // Observable that will emit search results
  searchResults$ = this.searchTerms.pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),
    
    // ignore if same as previous search term
    distinctUntilChanged(),
    
    // switch to new search observable each time the term changes
    switchMap((term: string) => {
      // Return empty array if search term is empty
      if (!term.trim()) {
        return of([]);
      }
      
      // Call the search API
      return this.http.get<any[]>(`${this.searchUrl}?keyword=${term}`)
        .pipe(
          catchError(error => {
            console.error('Error searching products:', error);
            return of([]);
          })
        );
    })
  );

  constructor(private http: HttpClient) { }

  // Push a search term into the observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }
}   