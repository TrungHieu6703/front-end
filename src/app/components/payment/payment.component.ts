import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CardModule, RadioButtonModule, FormsModule,InputTextModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  ingredient!: string;
  value: string | undefined;
}
