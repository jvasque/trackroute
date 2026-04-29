import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateRoutePayload, RouteItem, RouteStatus } from '../../models/route.model';

export type RouteFormMode = 'create' | 'edit';

export type RouteFormValue = CreateRoutePayload;

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.css'
})
export class RouteFormComponent implements OnChanges {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  @Input({ required: true }) disabled = false;
  @Input({ required: true }) submitting = false;
  @Input() mode: RouteFormMode = 'create';
  @Input() initialValue: RouteItem | null = null;
  @Output() saveRoute = new EventEmitter<RouteFormValue>();
  @Output() cancelEdit = new EventEmitter<void>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] || changes['mode']) {
      if (this.mode === 'edit' && this.initialValue) {
        this.form.reset({
          originCity: this.initialValue.originCity,
          destinationCity: this.initialValue.destinationCity,
          distanceKm: this.initialValue.distanceKm,
          estimatedTimeHours: this.initialValue.estimatedTimeHours,
          vehicleType: this.initialValue.vehicleType,
          carrier: this.initialValue.carrier,
          costUsd: this.initialValue.costUsd,
          status: this.initialValue.status
        });
      } else {
        this.reset();
      }
    }
  }

  submit(): void {
    if (this.disabled || this.submitting) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saveRoute.emit(this.form.getRawValue());
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

  handleSecondaryAction(): void {
    if (this.mode === 'edit') {
      this.cancelEdit.emit();
      return;
    }

    this.reset();
  }

  get title(): string {
    return this.mode === 'edit' ? 'Editar ruta' : 'Crear ruta';
  }

  get submitLabel(): string {
    if (this.submitting) {
      return this.mode === 'edit' ? 'Guardando...' : 'Creando...';
    }

    return this.mode === 'edit' ? 'Guardar cambios' : 'Crear ruta';
  }

  get secondaryLabel(): string {
    return this.mode === 'edit' ? 'Cancelar' : 'Limpiar';
  }

  hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
