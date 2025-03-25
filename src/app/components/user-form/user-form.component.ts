import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { FormArray } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext'; 
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, InputTextModule ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'] // Đúng cú pháp
})

export class UserFormComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      users: this.fb.array([]) // Create FormArray
    });

    this.initializeUsers(2); // Generate 5 user input fields
  }

  // Getter for easy access to users FormArray
  get usersFormArray(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  // Initialize form with N users
  initializeUsers(count: number) {
    for (let i = 0; i < count; i++) {
      this.addUser();
    }
  }

  // Function to add a new user group
  addUser() {
    const userGroup = this.fb.group({
      attributeValueId: ['', Validators.required],
      value: ['', Validators.required],
    });
  
    // ✅ Thêm userGroup vào FormArray
    this.usersFormArray.push(userGroup);
  
    // ✅ Đúng cách tạo JSON
    const formData = new FormData();
    const attributesBlob = new Blob([JSON.stringify(userGroup.value)], { type: "application/json" });
    formData.append("attributes", attributesBlob);
  }
  

  // Submit the form and store data
  onSubmit() {
    if (this.userForm.valid) {
      console.log('Submitted Data:', this.userForm.value.users);
      this.userForm.reset(); // Reset the form
    } else {
      console.log('Form is invalid');
    }
  }
  
}
