import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateRoutePayload, RouteStatus } from '../../models/route.model';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.css'
})
export class RouteFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  @Input({ required: true }) disabled = false;
  @Input({ required: true }) submitting = false;
  @Output() createRoute = new EventEmitter<CreateRoutePayload>();

  readonly statuses: RouteStatus[] = ['ACTIVA', 'INACTIVA', 'SUSPENDIDA', 'EN_MANTENIMIENTO'];

  readonly form = this.formBuilder.group({
    originCity: ['', [Validators.required, Validators.maxLength(120)]],
    destinationCity: ['', [Validators.required, Validators.maxLength(120)]],
    distanceKm: [1, [Validators.required, Validators.min(1), Validators.max(50000)]],
    estimatedTimeHours: [1, [Validators.required, Validators.min(0.1), Validators.max(1000)]],
    vehicleType: ['', [Validators.required, Validators.maxLength(120)]],
    carrier: ['', [Validators.required, Validators.maxLength(120)]],
    costUsd: [0, [Validators.required, Validators.min(0), Validators.max(10000000)]],
    status: ['ACTIVA' as RouteStatus, [Validators.required]]
  });

  submit(): void {
    if (this.disabled || this.submitting) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.createRoute.emit(this.form.getRawValue());
  }

  reset(): void {
    this.form.reset({
      originCity: '',
      destinationCity: '',
      distanceKm: 1,
      estimatedTimeHours: 1,
      vehicleType: '',
      carrier: '',
      costUsd: 0,
      status: 'ACTIVA'
    });
  }

  hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
