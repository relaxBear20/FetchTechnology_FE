import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Coin } from '../../model/crypto-option.model';
import { Market } from '../../model/crypto-market.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-text-box',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.css']
})
export class TextBoxComponent implements OnInit {
  formControl = new FormControl('');
  options: Coin[] = []; // List of all coins
  filteredOptions: Coin[] = []; // Filtered list shown in autocomplete
  selectedCoin: Coin | null = null; // Store selected coin
  coinDetails: Market | null = null; // Store API response when a coin is selected

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Load all coin 
    this.fetchInit();
    this.formControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.filteredOptions = []),
        switchMap(value => of(this.filterOptions(value || '')))
      )
      .subscribe();
  }

  fetchInit() {
    this.http.get<Coin[]>(`${environment.apiUrl}/crypto/list`)
      .subscribe((response: Coin[]) => {
        this.options = response;
      });
  }

  filterOptions(query: string) {
    const filterValue = query.toLowerCase();
    this.filteredOptions = this.options.filter(option =>
      option.symbol.toLowerCase() === (filterValue)
    ) 
  }

  onSelectionChange(selectedValue: string) {
    this.selectedCoin = this.options.find(coin => coin.name === selectedValue) || null;

    if (this.selectedCoin) {
      this.fetchCoinDetails(this.selectedCoin.id);
    }
  }

  fetchCoinDetails(coinId: string) {
    this.http.get<Market[]>(`${environment.apiUrl}/crypto/market/${coinId}`)
      .subscribe((response: Market[]) => {
        this.coinDetails = response[0];
        console.log('Coin Details:', response);
      });
  }
}
